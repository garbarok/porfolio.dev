---
title: "Introduction to Astro 5: The Framework of the Future"
description: "Discover the new features of Astro 5 and why it's the best framework for building fast, modern websites."
pubDate: 2025-01-15
author: "Óscar Gallego"
tags: ["astro", "web development", "javascript"]
image:
  url: "/projects/snapcompress.webp"
  alt: "Astro 5 logo"
draft: false
---

## Why I Migrated My Portfolio to Astro 5

After trying Next.js, Gatsby, and other frameworks, Astro 5 convinced me with its radical approach: **zero JavaScript by default**. It's not marketing—it's an architectural decision that changes the game.

### The Problem Astro Solves

Most modern frameworks ship all JavaScript code to the browser, even for static content. This results in:

- **200-400KB bundles** for simple pages
- **Time to Interactive (TTI)** of 3-5 seconds on mobile
- **JavaScript execution time** that blocks the main thread

Astro inverts the paradigm: **HTML first, JavaScript only when necessary**.

## Content Layer API: The Change That Matters

The biggest innovation in Astro 5 is the Content Layer API. Previously, Content Collections only supported local files. Now you can load content from any source.

### Practical Example: Blog with Headless CMS

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Local content (Markdown)
const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/blog"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("Your Name"),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

### Advantages of the New Loader System

**1. Real Type-Safety**

Before, TypeScript trusted that your files followed the schema. Now, with Zod validation:

```typescript
// ❌ This will fail at BUILD TIME, not runtime
---
title: 123  # Error: Expected string, received number
pubDate: "invalid-date"  # Error: Invalid date
---
```

**2. Build Performance**

In my portfolio (20 pages), the build improved from **45s to 12s**. Why?

- **Smart caching**: Only recompiles modified files
- **Parallel processing**: Processes multiple sources simultaneously
- **Optimized tree-shaking**: Eliminates unused code from Zod validations

**3. Unlimited Flexibility**

You can combine multiple sources:

```typescript
// Future: Load from external API
import { strapiLoader } from '@astrojs/strapi-loader';

const externalBlog = defineCollection({
  loader: strapiLoader({
    url: 'https://api.example.com',
    collection: 'posts'
  }),
  schema: z.object({...}),
});
```

## Islands Architecture: Selective Hydration

This is the concept that differentiates Astro from other frameworks.

### Traditional Problem

With Next.js or Nuxt, if you have an interactive button, **the entire page** gets hydrated:

```jsx
// Next.js: Ships ENTIRE bundle to browser
export default function Page() {
  return (
    <div>
      <Header /> {/* Static, but gets hydrated */}
      <Article /> {/* Static, but gets hydrated */}
      <InteractiveButton /> {/* Needs hydration */}
      <Footer /> {/* Static, but gets hydrated */}
    </div>
  );
}
```

### Astro Solution

```astro
---
import Header from './Header.astro';
import Article from './Article.astro';
import InteractiveButton from './InteractiveButton.svelte';
import Footer from './Footer.astro';
---

<Header />
<Article />
<!-- Only this component gets hydrated -->
<InteractiveButton client:visible />
<Footer />
```

**Real result**: My homepage went from **180KB of JS** (Next.js) to **12KB** (only dark mode button).

## Hydration Directives: When to Use Each

| Directive | Best Use | JS Bundle |
|-----------|----------|-----------|
| `client:load` | Critical above-the-fold components | Loads immediately |
| `client:idle` | Non-critical widgets | Waits for `requestIdleCallback` |
| `client:visible` | Below-the-fold components | Loads when entering viewport |
| `client:media` | Responsive components | Conditional by media query |
| `client:only` | Embedded SPAs | Browser only |

### Real Example: Image Gallery

```astro
---
import ImageGallery from '@components/ImageGallery.react';
---

<!-- Only loads when user scrolls to it -->
<ImageGallery
  client:visible
  images={galleryImages}
/>
```

## Migration from Another Framework

### From Next.js

**Common challenges:**

1. **API Routes**: Astro doesn't have `/pages/api`. Use [endpoints](https://docs.astro.build/en/guides/endpoints/):

```typescript
// src/pages/api/newsletter.ts
export async function POST({ request }) {
  const data = await request.json();
  // Your logic here
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

2. **Dynamic routes**: Change `[id].js` to `[id].astro`, use `getStaticPaths`:

```astro
---
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { id: post.id },
    props: { post }
  }));
}
---
```

3. **Data fetching**: No `getServerSideProps`. In Astro **everything runs at build time**:

```astro
---
// This runs on the server during build
const response = await fetch('https://api.example.com/data');
const data = await response.json();
---

<div>{data.title}</div>
```

## Real Benchmarks: My Portfolio

**Before (Next.js 14):**
- First Contentful Paint: 1.2s
- Time to Interactive: 3.4s
- Total Blocking Time: 890ms
- Bundle size: 245KB (gzipped)

**After (Astro 5):**
- First Contentful Paint: 0.4s ⚡
- Time to Interactive: 0.6s ⚡
- Total Blocking Time: 0ms ⚡
- Bundle size: 18KB (only dark mode toggle)

**Lighthouse Score: 100/100** in all categories.

## Ideal Use Cases

**✅ Perfect for:**
- Blogs and portfolios
- Marketing sites
- Technical documentation
- E-commerce with static catalogs
- High-performance landing pages

**❌ Not recommended for:**
- Real-time dashboards
- SPAs with lots of shared state
- Apps requiring dynamic SSR (use Astro with SSR adapter)
- Gmail or Figma-like applications

## Production Tips

### 1. Image Optimization

```astro
---
import { Image } from 'astro:assets';
import heroImage from '@assets/hero.jpg';
---

<!-- Generates multiple sizes automatically -->
<Image
  src={heroImage}
  alt="Hero"
  widths={[400, 800, 1200]}
  sizes="(max-width: 800px) 100vw, 800px"
  loading="eager"
/>
```

### 2. Prefetching for Instant Navigation

```astro
<script>
  // Prefetch on link hover
  document.querySelectorAll('a[href^="/"]').forEach(link => {
    link.addEventListener('mouseenter', () => {
      const href = link.getAttribute('href');
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = href;
      document.head.appendChild(prefetchLink);
    });
  });
</script>
```

### 3. Dark Mode Without FOUC (Flash of Unstyled Content)

```astro
<script is:inline>
  // Runs before render to avoid flash
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.classList.add(theme);
</script>
```

## Conclusion

Astro 5 isn't "just another framework." It's a radical bet on performance without sacrificing DX. After 6 months using it in production:

- **Faster deployments**: Builds from 45s to 12s
- **Reduced costs**: CDN edge hosting at $0/month (Vercel free tier)
- **Improved SEO**: Perfect Core Web Vitals
- **Less complexity**: No hydration bugs, no bundle size anxiety

If you're building a content-heavy site, Astro 5 should be on your radar.
