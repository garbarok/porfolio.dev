---
title: "Astro Content Collections: Por qué desaparecen tus campos del schema"
description: "Guía de depuración: Cómo la ubicación incorrecta del archivo de configuración de contenido causa que los campos del schema desaparezcan en proyectos Astro 5."
pubDate: 2025-01-20
author: "Óscar Gallego"
tags: ["astro", "debugging", "content collections", "typescript"]
draft: false
relatedSlug: "astro-content-config-location"
image:
  url: "/projects/snapcompress.webp"
  alt: "Ilustración de depuración de Astro"
---

## El misterio de los campos del schema que desaparecen

Mientras implementaba soporte multiidioma para mi blog, me encontré con un problema frustrante: **los campos personalizados del schema desaparecían de mis colecciones de contenido** a pesar de estar claramente definidos en el schema y presentes en el frontmatter.

### Los síntomas

Esto es lo que estaba experimentando:

```typescript
// src/content/config.ts
const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/blog"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // ... otros campos
    translation: z.string().optional(), // ❌ ¡Este campo desaparecía!
  }),
});
```

**El problema:**
- ✅ Campo definido en el schema: `translation: z.string().optional()`
- ✅ Campo presente en el frontmatter: `translation: "version-espanola"`
- ❌ Campo ausente en los tipos de TypeScript
- ❌ Campo ausente en runtime: `'translation' in post.data` retornaba `false`

### La investigación

Inicialmente pensé que era un bug de Astro 5.16.0 donde los campos opcionales se eliminaban. Probé múltiples enfoques:

**Intento 1: Usar `.default()` en lugar de `.optional()`**
```typescript
translation: z.string().default("") // ❌ ¡Seguía desapareciendo!
```

**Intento 2: Hacerlo requerido**
```typescript
translation: z.string() // ❌ ¡Seguía desapareciendo!
```

**Intento 3: Cambiar el nombre del campo**
```typescript
relatedSlug: z.string() // ❌ ¡Seguía desapareciendo!
```

Nada funcionaba. ¡Incluso los **campos requeridos** se eliminaban!

### La causa raíz

Después de una depuración exhaustiva, descubrí el problema: **estaba editando el archivo de configuración equivocado**.

```bash
# Lo que tenía:
src/content/config.ts        ❌ Ubicación INCORRECTA (siendo editada)
src/content.config.ts         ✅ Ubicación CORRECTA (siendo usada por Astro)
```

Según la [documentación de Astro](https://docs.astro.build/en/guides/content-collections/), el archivo de configuración de contenido debe ser:

- **Nombre del archivo:** `content.config.ts` (no solo `config.ts`)
- **Ubicación:** `src/content.config.ts` (en la raíz de `src`, NO dentro de la carpeta `content`)

### Por qué sucedió esto

Había creado inadvertidamente un archivo de configuración duplicado en la ubicación incorrecta:

```
src/
├── content/
│   ├── blog/
│   └── config.ts          ❌ Estaba editando este
└── content.config.ts      ✅ Astro estaba usando este
```

Cuando actualizaba `src/content/config.ts`, Astro lo ignoraba completamente porque solo lee desde `src/content.config.ts`.

### La solución

**Paso 1: Verificar la ubicación correcta del archivo**

```bash
# Verificar qué archivo existe
ls -la src/content*.ts

# Debería devolver:
# src/content.config.ts  ✅ Esto es correcto
```

**Paso 2: Eliminar archivos de configuración duplicados**

```bash
# Si tienes un duplicado, elimínalo
rm src/content/config.ts
```

**Paso 3: Actualizar el archivo CORRECTO**

```typescript
// src/content.config.ts ✅
import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/blog"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    relatedSlug: z.string(), // ✅ ¡Ahora funciona!
  }),
});

export const collections = { blog };
```

**Paso 4: Limpiar la caché de Astro y reconstruir**

```bash
rm -rf .astro
npm run build
```

### Verificación

Después de corregir la ubicación del archivo, todo funcionó perfectamente:

```typescript
// ¡Ahora esto funciona! ✅
const posts = await getCollection('blog');
const currentPost = posts.find(/* ... */);

// El campo es accesible
const relatedSlug = currentPost.data.relatedSlug; // ✅ ¡Funciona!

// Los tipos de TypeScript son correctos
// No más errores de "Property 'relatedSlug' does not exist"
```

### Conclusiones clave

1. **El nombre del archivo importa:** Usa `content.config.ts`, no `config.ts`
2. **La ubicación importa:** Colócalo en la raíz de `src/`, no dentro de `src/content/`
3. **Verifica duplicados:** Busca archivos de configuración en conflicto
4. **Limpia la caché:** Siempre ejecuta `rm -rf .astro` después de cambios importantes de configuración
5. **Verifica la ruta de importación:** Las definiciones de tipos de Astro referencian `src/content.config.js`

### Cómo evitar este problema

**1. Usa las convenciones correctas de Astro:**
```bash
# Ubicación correcta del config de contenido
src/content.config.ts        ✅

# NO estas ubicaciones:
src/content/config.ts        ❌
src/contentConfig.ts         ❌
content.config.ts            ❌
```

**2. Verifica los tipos generados:**
```typescript
// .astro/content.d.ts debería referenciar:
export type ContentConfig = typeof import("../src/content.config.js");
//                                          ^^^^^^^^^^^^^^^^^^
// Si esta ruta está mal, ¡estás editando el archivo equivocado!
```

**3. Presta atención a los errores de TypeScript:**
Si ves errores de "Property does not exist" para campos que SABES que definiste, verifica la ubicación de tu archivo de configuración antes de asumir que es un bug de Astro.

## Implementación en el mundo real

Así es como lo uso para publicaciones de blog multiidioma:

**Frontmatter (versión en inglés):**
```markdown
---
title: "Introduction to Astro 5"
relatedSlug: "introduccion-astro-5"  # Slug de la versión en español
---
```

**Frontmatter (versión en español):**
```markdown
---
title: "Introducción a Astro 5"
relatedSlug: "introduction-astro-5"  # Slug de la versión en inglés
---
```

**Implementación del cambio de idioma:**
```typescript
// src/i18n/utils.ts
export async function getTranslatedBlogPath(
  currentSlug: string,
  currentLang: Language,
  targetLang: Language
): Promise<string | null> {
  const { getCollection } = await import('astro:content');
  const posts = await getCollection('blog');

  const currentPost = posts.find(post => {
    const slug = post.id.replace(/^(en|es)\//, '');
    return slug === currentSlug && post.id.startsWith(`${currentLang}/`);
  });

  if (!currentPost?.data.relatedSlug) return null;

  const translatedSlug = currentPost.data.relatedSlug;

  // Verificar que el post traducido existe
  const translatedPost = posts.find(post => {
    const slug = post.id.replace(/^(en|es)\//, '');
    return slug === translatedSlug && post.id.startsWith(`${targetLang}/`);
  });

  if (!translatedPost) return null;

  return targetLang === 'es'
    ? `/blog/${translatedSlug}`
    : `/en/blog/${translatedSlug}`;
}
```

## Lista de verificación de depuración

Si tus campos del schema están desapareciendo, verifica estos puntos en orden:

- [ ] **Ubicación del archivo:** ¿Está en `src/content.config.ts`?
- [ ] **Nombre del archivo:** ¿Es `content.config.ts` (no `config.ts`)?
- [ ] **Sin duplicados:** ¿Solo existe UN archivo de configuración de contenido?
- [ ] **Caché limpiada:** ¿Ejecutaste `rm -rf .astro`?
- [ ] **Ruta de importación:** ¿`.astro/content.d.ts` referencia el archivo correcto?
- [ ] **Sintaxis del schema:** ¿Schema Zod válido con `z.object()`?
- [ ] **Exportado correctamente:** ¿Usas `export const collections = { ... }`?

## Conclusión

Este viaje de depuración me enseñó una lección importante: **cuando estés solucionando problemas con frameworks, siempre verifica primero que estás editando los archivos de configuración correctos**.

Lo que parecía un bug complejo de Astro era en realidad un simple error de configuración. ¡El framework funcionaba perfectamente—solo estaba mirando en el lugar equivocado!

¿Has encontrado problemas similares con Astro u otros frameworks? El diablo suele estar en los detalles como las convenciones de nombres y ubicación de archivos.

---

**Recursos relacionados:**
- [Documentación de Content Collections de Astro](https://docs.astro.build/en/guides/content-collections/)
- [API de Content Layer de Astro](https://docs.astro.build/en/guides/content-layer/)
- [Validación de Schema con Zod](https://zod.dev/)
