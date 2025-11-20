---
title: "Tailwind CSS 4: Everything You Need to Know"
description: "Explore the new features of Tailwind CSS 4 and how to leverage them in your web projects."
pubDate: 2025-01-10
author: "Óscar Gallego"
tags: ["tailwindcss", "css", "frontend"]
draft: false
---

## The Migration That Breaks Everything (and Why It's Worth It)

Tailwind CSS 4 isn't a minor update. It's a **complete rewrite** of the engine in Rust that breaks v3 compatibility in several critical aspects. After migrating 3 production projects, here's what nobody tells you.

## The Rust Engine: Real Performance Numbers

Before Tailwind v4, my project with ~500 components compiled in **8.5 seconds**. With v4: **890ms**.

### Comparative Benchmarks

| Metric | Tailwind v3 | Tailwind v4 | Improvement |
|---------|-------------|-------------|-------------|
| Initial build | 8.5s | 0.89s | **9.5x faster** |
| Rebuild (HMR) | 420ms | 45ms | **9.3x faster** |
| Memory usage | 340MB | 85MB | **75% less** |
| Output size | 12.4KB | 11.1KB | **10% smaller** |

**Why is it so fast?**

Rust enables true parallelization. Tailwind v4 processes files in multiple threads, while v3 is limited by Node.js's single-thread.

## CSS-First Configuration: Goodbye tailwind.config.js

The most radical change is eliminating the JavaScript configuration file.

### Before (v3)

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

### After (v4)

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Custom colors */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;

  /* Fonts */
  --font-sans: 'Inter', system-ui, sans-serif;

  /* Custom spacing */
  --spacing-128: 32rem;

  /* Breakpoints */
  --breakpoint-3xl: 1920px;
}

/* Plugins are now native CSS */
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";
```

**Advantages:**

1. **Improved type-safety**: CSS variables have better autocomplete in VSCode
2. **Instant hot reload**: Theme changes apply without recompiling
3. **Less abstraction**: What you see in CSS is what you get

## Vite Integration: The Correct Setup

**CRITICAL**: Don't use `@astrojs/tailwind` with Tailwind v4. It causes conflicts.

### Setup for Astro + Tailwind v4

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

**DON'T do this:**

```javascript
// ❌ WRONG
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()], // This breaks Tailwind v4
});
```

## `@apply` Limitations in v4

The most painful change: **`@apply` doesn't work inside `@keyframes`**.

### Case That Fails

```css
/* ❌ This BREAKS in Tailwind v4 */
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

### Solution: Vanilla CSS

```css
/* ✅ Use standard CSS in keyframes */
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

/* Then apply the animation */
.fade-enter {
  animation: fade-in 0.3s ease-out;
}
```

### Another Problematic Case: `@apply` with Dark Mode in Astro

```astro
<style>
  /* ❌ This may fail in some cases */
  .card {
    @apply bg-white dark:bg-gray-900;
  }
</style>
```

**Error:**
```
The `dark:bg-gray-900` class does not exist
```

**Solution:** Use CSS variables + regular classes:

```astro
<div class="card bg-white dark:bg-gray-900">
  <!-- content -->
</div>

<style>
  /* Only styles that don't depend on Tailwind */
  .card {
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
</style>
```

## Real Migration: The 5 Problems I Found

### 1. Outdated Plugins

**Problem:** Many v3 plugins don't work in v4.

**Temporary solution:**
```javascript
// Use the v4-compatible version
npm install @tailwindcss/typography@next @tailwindcss/forms@next
```

### 2. Custom Utilities with `addUtilities()`

**Before (v3):**
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

**After (v4):**
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

### 3. Arbitrary Values Change Syntax

**v3:**
```html
<div class="w-[calc(100%-2rem)]">
```

**v4:** (Works the same, but now with better autocompletion)
```html
<div class="w-[calc(100%-2rem)]">
```

### 4. Color Opacity Syntax

**v3:**
```html
<div class="bg-blue-500/50">
```

**v4:** (No changes, but now more efficient)
```html
<div class="bg-blue-500/50">
```

### 5. Container Queries

**Before:** Required plugin

**Now:** Built-in in v4

```html
<div class="@container">
  <div class="@md:grid-cols-2">
    <!-- Adapts to container, not viewport -->
  </div>
</div>
```

## Dark Mode: Class vs Attribute

Tailwind v4 improves support for class-based dark mode.

### Recommended Configuration

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));
```

This allows:

```html
<!-- Option 1: Class on root -->
<html class="dark">
  <div class="bg-white dark:bg-gray-900">
</html>

<!-- Option 2: Class on specific container -->
<div class="dark">
  <p class="text-gray-900 dark:text-white">
</div>
```

### Avoid FOUC (Flash of Unstyled Content)

```html
<script>
  // Execute BEFORE render
  if (localStorage.theme === 'dark' ||
      (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
</script>
```

## Automatic Migration Tool

```bash
npx @tailwindcss/upgrade@next
```

**What it does:**

✅ Converts `tailwind.config.js` to `@theme` in CSS
✅ Updates imports in files
✅ Detects incompatible plugins
❌ **DOESN'T** migrate custom utilities (do it manually)
❌ **DOESN'T** fix `@apply` in keyframes (you must rewrite)

## Production Performance Tips

### 1. Aggressive Purge (no longer needed)

In v3, you had to configure `purge`. In v4, **tree-shaking is automatic and smarter**.

### 2. Use CSS Nesting

```css
/* Take advantage of native CSS nesting */
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

### 3. Optimize Fonts with CSS Variables

```css
@theme {
  --font-sans: 'Inter var', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

Then use `font-variation-settings` for dynamic weights:

```css
.dynamic-weight {
  font-variation-settings: 'wght' var(--font-weight);
}
```

## Real Migration Cases

### Personal Portfolio (20 pages)

- **Migration time:** 2 hours
- **Build time:** 6.2s → 0.78s
- **Problems found:** 3 custom plugins (rewritten to CSS)

### SaaS Dashboard (150 components)

- **Migration time:** 1 day
- **Build time:** 14.5s → 1.2s
- **Problems found:** `@apply` in keyframes (8 cases), custom animation plugin

### E-commerce (300+ components)

- **Migration time:** 2 days
- **Build time:** 28s → 2.1s
- **Problems found:** Conflict with @astrojs/tailwind, 15 custom utilities migrated

## Is It Worth Migrating Now?

**YES, if:**
- Your build time is >5 seconds
- You use Vite/Astro (better integration)
- You're starting a new project
- You want to leverage native container queries

**WAIT, if:**
- You have many incompatible custom plugins
- Your team can't dedicate 1-2 days to migration
- You rely heavily on `@apply` in keyframes
- You use frameworks that don't officially support v4 yet

## Conclusion: The Future Is Faster

After 3 months in production with Tailwind v4:

- **Deploy times:** Reduced by 65%
- **Developer experience:** Instant HMR (no perceptible lag)
- **Bundle size:** 10-15% smaller
- **Bugs:** Only 2 edge cases with dark mode in Safari

Tailwind v4 isn't perfect, but it's the future. The migration hurts at first, but the result is worth every minute invested.
