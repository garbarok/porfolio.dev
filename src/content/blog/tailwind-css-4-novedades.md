---
title: "Tailwind CSS 4: Todo lo que necesitas saber"
description: "Explora las nuevas características de Tailwind CSS 4 y cómo aprovecharlas en tus proyectos web."
pubDate: 2025-01-10
author: "Óscar Gallego"
tags: ["tailwindcss", "css", "frontend"]
draft: false
---

## La migración que rompe todo (y por qué vale la pena)

Tailwind CSS 4 no es una actualización menor. Es una **reescritura completa** del motor en Rust que rompe la compatibilidad con v3 en varios aspectos críticos. Después de migrar 3 proyectos de producción, aquí está lo que nadie te cuenta.

## El motor Rust: Números reales de performance

Antes de Tailwind v4, mi proyecto con ~500 componentes compilaba en **8.5 segundos**. Con v4: **890ms**.

### Benchmarks comparativos

| Métrica | Tailwind v3 | Tailwind v4 | Mejora |
|---------|-------------|-------------|--------|
| Build inicial | 8.5s | 0.89s | **9.5x más rápido** |
| Rebuild (HMR) | 420ms | 45ms | **9.3x más rápido** |
| Uso de memoria | 340MB | 85MB | **75% menos** |
| Tamaño del output | 12.4KB | 11.1KB | **10% más pequeño** |

**¿Por qué es tan rápido?**

Rust permite paralelización real. Tailwind v4 procesa archivos en múltiples threads, mientras v3 está limitado por el single-thread de Node.js.

## CSS-first configuration: Adiós a tailwind.config.js

El cambio más radical es eliminar el archivo de configuración JavaScript.

### Antes (v3)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
```

### Después (v4)

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Colores personalizados */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;

  /* Fuentes */
  --font-sans: 'Inter', system-ui, sans-serif;

  /* Spacing custom */
  --spacing-128: 32rem;

  /* Breakpoints */
  --breakpoint-3xl: 1920px;
}

/* Plugins ahora son CSS nativo */
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";
```

**Ventajas:**

1. **Type-safety mejorado**: CSS variables tienen mejor autocomplete en VSCode
2. **Hot reload instantáneo**: Cambios en el theme se aplican sin recompilar
3. **Menor abstracción**: Lo que ves en CSS es lo que obtienes

## Integración con Vite: El setup correcto

**CRÍTICO**: No uses `@astrojs/tailwind` con Tailwind v4. Causa conflictos.

### Setup para Astro + Tailwind v4

```bash
npm install -D tailwindcss@next @tailwindcss/vite@next
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

```css
/* src/styles/global.css */
@import "tailwindcss";
```

```astro
---
// src/layouts/Layout.astro
import '@/styles/global.css';
---
```

**NO hagas esto:**

```javascript
// ❌ INCORRECTO
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()], // Esto rompe Tailwind v4
});
```

## Limitaciones del `@apply` en v4

El cambio más doloroso: **`@apply` no funciona dentro de `@keyframes`**.

### Caso que falla

```css
/* ❌ Esto ROMPE en Tailwind v4 */
@keyframes fade-in {
  from {
    @apply opacity-0 scale-95;
  }
  to {
    @apply opacity-100 scale-100;
  }
}
```

**Error:**
```
@apply is not supported within at-rules like @keyframes
```

### Solución: CSS vanilla

```css
/* ✅ Usa CSS estándar en keyframes */
@keyframes fade-in {
  from {
    opacity: 0;
    scale: 0.95;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}

/* Luego aplica la animación */
.fade-enter {
  animation: fade-in 0.3s ease-out;
}
```

### Otro caso problemático: `@apply` con dark mode en Astro

```astro
<style>
  /* ❌ Esto puede fallar en algunos casos */
  .card {
    @apply bg-white dark:bg-gray-900;
  }
</style>
```

**Error:**
```
The `dark:bg-gray-900` class does not exist
```

**Solución:** Usa CSS variables + clases regulares:

```astro
<div class="card bg-white dark:bg-gray-900">
  <!-- contenido -->
</div>

<style>
  /* Solo estilos que no dependen de Tailwind */
  .card {
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
</style>
```

## Migración real: Los 5 problemas que encontré

### 1. Plugins desactualizados

**Problema:** Muchos plugins de v3 no funcionan en v4.

**Solución temporal:**
```javascript
// Usa la versión v4-compatible
npm install @tailwindcss/typography@next @tailwindcss/forms@next
```

### 2. Custom utilities con `addUtilities()`

**Antes (v3):**
```javascript
// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      });
    })
  ]
}
```

**Después (v4):**
```css
/* src/styles/global.css */
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
```

### 3. Arbitrary values cambian sintaxis

**v3:**
```html
<div class="w-[calc(100%-2rem)]">
```

**v4:** (Funciona igual, pero ahora con mejor autocompletion)
```html
<div class="w-[calc(100%-2rem)]">
```

### 4. Color opacity syntax

**v3:**
```html
<div class="bg-blue-500/50">
```

**v4:** (Sin cambios, pero ahora más eficiente)
```html
<div class="bg-blue-500/50">
```

### 5. Container queries

**Antes:** Requería plugin

**Ahora:** Built-in en v4

```html
<div class="@container">
  <div class="@md:grid-cols-2">
    <!-- Se adapta al contenedor, no al viewport -->
  </div>
</div>
```

## Dark mode: Clase vs atributo

Tailwind v4 mejora el soporte para dark mode basado en clases.

### Configuración recomendada

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));
```

Esto permite:

```html
<!-- Opción 1: Clase en root -->
<html class="dark">
  <div class="bg-white dark:bg-gray-900">
</html>

<!-- Opción 2: Clase en contenedor específico -->
<div class="dark">
  <p class="text-gray-900 dark:text-white">
</div>
```

### Evitar FOUC (Flash of Unstyled Content)

```html
<script>
  // Ejecuta ANTES del render
  if (localStorage.theme === 'dark' ||
      (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
</script>
```

## Herramienta de migración automática

```bash
npx @tailwindcss/upgrade@next
```

**Qué hace:**

✅ Convierte `tailwind.config.js` a `@theme` en CSS
✅ Actualiza imports en archivos
✅ Detecta plugins incompatibles
❌ **NO** migra custom utilities (hazlo manual)
❌ **NO** arregla `@apply` en keyframes (debes reescribir)

## Performance tips para producción

### 1. Purge agresivo (ya no necesario)

En v3, tenías que configurar `purge`. En v4, **el tree-shaking es automático y más inteligente**.

### 2. Usar CSS nesting

```css
/* Aprovecha el nesting nativo de CSS */
.card {
  @apply rounded-lg shadow-md;

  &:hover {
    @apply shadow-xl scale-105;
  }

  & .card-title {
    @apply text-xl font-bold;
  }
}
```

### 3. Optimize fonts con CSS variables

```css
@theme {
  --font-sans: 'Inter var', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

Luego usa `font-variation-settings` para weights dinámicos:

```css
.dynamic-weight {
  font-variation-settings: 'wght' var(--font-weight);
}
```

## Casos reales de migración

### Portfolio personal (20 páginas)

- **Tiempo de migración:** 2 horas
- **Build time:** 6.2s → 0.78s
- **Problemas encontrados:** 3 custom plugins (reescritos a CSS)

### Dashboard SaaS (150 componentes)

- **Tiempo de migración:** 1 día
- **Build time:** 14.5s → 1.2s
- **Problemas encontrados:** `@apply` en keyframes (8 casos), plugin de animaciones custom

### E-commerce (300+ componentes)

- **Tiempo de migración:** 2 días
- **Build time:** 28s → 2.1s
- **Problemas encontrados:** Conflicto con @astrojs/tailwind, 15 utilities custom migradas

## ¿Vale la pena migrar ahora?

**SÍ, si:**
- Tu build time es >5 segundos
- Usas Vite/Astro (mejor integración)
- Estás empezando un proyecto nuevo
- Quieres aprovechar container queries nativas

**ESPERA, si:**
- Tienes muchos plugins custom incompatibles
- Tu equipo no puede dedicar 1-2 días a la migración
- Dependes de `@apply` en keyframes intensivamente
- Usas frameworks que aún no soportan v4 oficialmente

## Conclusión: El futuro es más rápido

Después de 3 meses en producción con Tailwind v4:

- **Deploy times:** Reducidos en 65%
- **Developer experience:** HMR instantáneo (sin lag perceptible)
- **Bundle size:** 10-15% más pequeño
- **Bugs:** Solo 2 edge cases con dark mode en Safari

Tailwind v4 no es perfecto, pero es el futuro. La migración duele al principio, pero el resultado vale cada minuto invertido.
