---
title: "Debug Astro: Arregla \"Campos de Schema Ocultos\" en 5 Min"
description: "¿No encuentras tus campos de schema en Astro? Probablemente editas el archivo incorrecto. Aprende el error #1 con `content.config.ts` y soluciónalo al instante. ✓"
pubDate: 2025-11-18
author: "Óscar Gallego"
tags: ["astro", "debugging", "content collections", "typescript"]
draft: false
relatedSlug: "astro-content-config-location"
image:
  url: "https://res.cloudinary.com/dl0qx4iof/image/upload/blog/astro-debugging.png"
  alt: "Un desarrollador depurando archivos de configuración de Astro en una pantalla de ordenador."
---

## ¿Por Qué No se Actualizan los Campos de mi Schema en Astro?

Si has añadido campos a tu schema de Astro Content Collections y no aparecen, el problema más común es un error en la ubicación o el nombre del archivo de configuración. Astro es muy estricto y solo busca un archivo de configuración en una ubicación específica: `src/content.config.ts`.

Antes de depurar a fondo, revisa esta checklist:

1.  **Ubicación Correcta:** Asegúrate de que tu archivo de configuración esté en la raíz de `src/`, no dentro de `src/content/`.
    - ✅ **Correcto:** `src/content.config.ts`
    - ❌ **Incorrecto:** `src/content/config.ts`
2.  **Nombre Exacto:** El archivo debe llamarse `content.config.ts`. Cualquier otra variación será ignorada.
3.  **Sin Duplicados:** Busca en tu proyecto para asegurarte de que no exista otro archivo de configuración que Astro pueda estar leyendo en su lugar.
4.  **Limpia la Caché:** Elimina el directorio `.astro` y reinicia el servidor de desarrollo para forzar a Astro a regenerar los tipos a partir del archivo de configuración correcto.

¿Alguna vez has definido un campo en tu schema de Astro Content Collections solo para que se desvanezca en tiempo de ejecución? No estás solo. Recientemente pasé horas depurando un problema en el que los campos de mi schema desaparecían inexplicablemente, a pesar de estar definidos correctamente.

> **TL;DR: El Problema y la Solución**
> **Problema:** Mis nuevos campos de schema desaparecían porque estaba editando `src/content/config.ts`.
> **Solución:** Astro solo reconoce `src/content.config.ts`. Tuve que mover mis cambios al archivo con el nombre y la ubicación correctos y eliminar el duplicado.

Este artículo te guía a través del proceso de depuración, la causa raíz y cómo puedes evitar este error común.

## El Misterio de los Campos del Schema que Desaparecen

Mientras añadía un campo `relatedSlug` al schema de mi blog para soporte multiidioma, me topé con un muro. El campo estaba definido en el schema y presente en el frontmatter del Markdown, pero estaba completamente ausente en el objeto `post.data`.

### Los Síntomas

Mi configuración parecía correcta, pero el campo `relatedSlug` no aparecía por ningún lado en los tipos de TypeScript ni en tiempo de ejecución.

```typescript
// src/content/config.ts
import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    // ... otros campos
    relatedSlug: z.string().optional(), // ❌ ¡Este campo desaparecía!
  }),
});

export const collections = { blog: blogCollection };
```

- ✅ **Definido en el Schema:** El campo `relatedSlug` era claramente parte del schema de Zod.
- ✅ **Presente en el Frontmatter:** Mis archivos `.md` incluían `relatedSlug: "un-slug-cualquiera"`.
- ❌ **Ausente en Runtime:** `'relatedSlug' in post.data` devolvía `false`.

### La Investigación: Qué no Funcionó

Sospeché de un bug en Astro o Zod, así que probé varias soluciones alternativas, ninguna de las cuales resolvió el problema:

1.  **Usar `.default()`:** Reemplacé `.optional()` por `.default("")`, esperando forzar la existencia del campo. El campo seguía ausente.
2.  **Hacerlo Requerido:** Eliminé `.optional()`, haciendo el campo obligatorio. Astro debería haber lanzado un error por campos faltantes, pero no lo hizo. El campo seguía sin aparecer.
3.  **Cambiar el Nombre del Campo:** Renombré `relatedSlug` a `translation` para descartar un conflicto de nombres. El nuevo campo también desapareció.

El hecho de que incluso los **campos requeridos** fueran ignorados fue una pista importante de que algo estaba fundamentalmente mal en cómo Astro leía mi configuración.

## La Causa Raíz: Un Simple Error de Ubicación

Después de horas de depuración, la respuesta fue vergonzosamente simple: **estaba editando el archivo equivocado.**

Según la documentación de Astro, el archivo de configuración de las colecciones de contenido tiene requisitos estrictos de nombre y ubicación.

- **Archivo Correcto:** `src/content.config.ts`
- **Mi Archivo:** `src/content/config.ts`

> Había creado accidentalmente un archivo de configuración dentro del directorio `content`. Astro estaba ignorando por completo este archivo y leyendo una versión más antigua de `content.config.ts` ubicada en la raíz de `src`.

Esta sutil diferencia era la fuente de todos mis problemas.

## La Solución: Un Arreglo en 4 Pasos

Solucionar el problema fue sencillo una vez que identifiqué la causa raíz.

### Paso 1: Localiza el Archivo de Configuración Correcto

Primero, tuve que confirmar qué archivo estaba usando Astro realmente. Los tipos generados en `.astro/` dan la respuesta.

```typescript
// .astro/content.d.ts
// Esta línea revela la fuente de la verdad:
export type ContentConfig = typeof import("../src/content.config.js");
```

### Paso 2: Consolida y Elimina

Copié mis últimas definiciones de schema del archivo incorrecto (`src/content/config.ts`) al correcto (`src/content.config.ts`) y luego eliminé el duplicado.

```bash
# Elimina el archivo de configuración incorrecto
rm src/content/config.ts
```

### Paso 3: Actualiza el Archivo Correcto

Con el duplicado eliminado, me aseguré de que el archivo correcto (`src/content.config.ts`) tuviera el schema final.

```typescript
// src/content.config.ts ✅
import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    // ... todos mis campos
    relatedSlug: z.string(), // ✅ ¡Ahora funciona!
  }),
});

export const collections = { blog: blogCollection };
```

### Paso 4: Limpia la Caché

Finalmente, para asegurar que Astro recogiera los cambios, limpié la caché y reinicié el servidor de desarrollo.

```bash
# Limpia el directorio de caché .astro
rm -rf .astro
# Reinicia el servidor de desarrollo
npm run dev
```

Después de estos pasos, el campo `relatedSlug` apareció correctamente en mis tipos y en tiempo de ejecución.

## Checklist de Depuración para Content Collections de Astro

Si te enfrentas a un problema similar, revisa esta lista antes de sumergirte en una depuración profunda:

- [ ] **Ubicación Correcta:** ¿Está tu archivo de configuración en `src/content.config.ts`?
- [ ] **Nombre Correcto:** ¿Se llama `content.config.ts` exactamente?
- [ ] **Sin Duplicados:** ¿Hay solo un archivo `content.config.ts` en tu proyecto?
- [ ] **Caché Limpiada:** ¿Has intentado eliminar el directorio `.astro`?
- [ ] **Exportación del Schema:** ¿Tu archivo de configuración exporta correctamente `export const collections`?

## Conclusión

Esta experiencia fue un recordatorio clásico: **domina las convenciones de tu framework.** Lo que parecía un bug complejo era una simple configuración errónea. Antes de sospechar de un error en la herramienta, siempre verifica que estás siguiendo sus convenciones fundamentales.