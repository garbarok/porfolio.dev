---
title: "Introduction to Astro 5: The Framework of the Future"
description: "Discover the new features of Astro 5 and why it's the best framework for building fast, modern websites."
pubDate: 2025-11-15
author: "Óscar Gallego"
tags: ["astro", "web development", "javascript"]
image:
  url: "https://res.cloudinary.com/dl0qx4iof/image/upload/blog/astro-introduction.png"
  alt: "Astro 5 framework - rocket illustration with zero JavaScript concept"
draft: false
relatedSlug: "introduccion-astro-5"
---

## Why I migrated my portfolio to Astro 5

After trying Next.js, Gatsby, and other frameworks, Astro 5 won me over with its radical approach: **zero JavaScript by default**. This isn't marketing hype—it's an architectural decision that changes the game.

### The problem Astro solves

Most modern frameworks ship all JavaScript code to the browser, even for static content. This results in:

- **200-400KB bundles** for simple pages
- **Time to Interactive (TTI)** of 3-5 seconds on mobile
- **JavaScript execution time** that blocks the main thread

Astro flips the paradigm: **HTML first, JavaScript only when necessary**.

## Content Layer API: The game-changing feature

Astro 5's biggest innovation is the Content Layer API. Previously, Content Collections only supported local files. Now you can load content from any source.

### Practical example: Blog with headless CMS

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

### Advantages of the new loader system

**1. Real type-safety**

Before, TypeScript trusted your files followed the schema. Now, with Zod validation:

```typescript
// ❌ This will FAIL at BUILD TIME, not runtime
---
title: 123  # Error: Expected string, received number
pubDate: "invalid-date"  # Error: Invalid date
---
```

**2. Build performance**

In my portfolio (20 pages), build time improved from **45s to 12s**. Why?

- **Smart caching**: Only recompiles modified files
- **Parallel processing**: Processes multiple sources simultaneously
- **Optimized tree-shaking**: Eliminates unused code from Zod validations

**3. Unlimited flexibility**

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

## Islands Architecture: Selective hydration

This is the concept that sets Astro apart from other frameworks.

### Traditional problem

With Next.js or Nuxt, if you have an interactive button, **the entire page** gets hydrated:

```jsx
// Next.js: Ships the ENTIRE bundle to the browser
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

### Astro solution

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

**Real results**: My homepage went from **180KB of JS** (Next.js) to **12KB** (just the dark mode toggle).

## Hydration directives: When to use each one

| Directive | Ideal use | JS Bundle |
|-----------|-----------|-----------|
| `client:load` | Critical above-the-fold components | Loads immediately |
| `client:idle` | Non-critical widgets | Waits for `requestIdleCallback` |
| `client:visible` | Below-the-fold components | Loads when entering viewport |
| `client:media` | Responsive components | Conditional per media query |
| `client:only` | Embedded SPAs | Browser only |

### Real example: Image gallery

```astro
---
import ImageGallery from '@components/ImageGallery.react';
---

<!-- Only loads when user scrolls here -->
<ImageGallery
  client:visible
  images={galleryImages}
/>
```

## Migrating from another framework

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
// This executes on the server during build
const response = await fetch('https://api.example.com/data');
const data = await response.json();
---

<div>{data.title}</div>
```

## Real benchmarks: My portfolio

**Before (Next.js 14):**
- First Contentful Paint: 1.2s
- Time to Interactive: 3.4s
- Total Blocking Time: 890ms
- Bundle size: 245KB (gzipped)

**After (Astro 5):**
- First Contentful Paint: 0.4s ⚡
- Time to Interactive: 0.6s ⚡
- Total Blocking Time: 0ms ⚡
- Bundle size: 18KB (dark mode toggle only)

**Lighthouse Score: 100/100** across all categories.

## Ideal use cases

**✅ Perfect for:**
- Blogs and portfolios
- Marketing sites
- Technical documentation
- E-commerce with static catalogs
- High-performance landing pages

**❌ Not recommended for:**
- Dashboards with real-time updates
- SPAs with heavy shared state
- Apps requiring dynamic SSR (use Astro with SSR adapter)
- Apps like Gmail or Figma

## Production tips

### 1. Image optimization

```astro
---
import { Image } from 'astro:assets';
import heroImage from '@assets/hero.jpg';
---

<!-- Automatically generates multiple sizes -->
<Image
  src={heroImage}
  alt="Hero"
  widths={[400, 800, 1200]}
  sizes="(max-width: 800px) 100vw, 800px"
  loading="eager"
/>
```

### 2. Prefetching for instant navigation

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

### 3. Dark mode without FOUC (Flash of Unstyled Content)

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
- **Lower costs**: CDN edge hosting at $0/month (Vercel free tier)
- **Improved SEO**: Perfect Core Web Vitals
- **Less complexity**: No hydration bugs, no bundle size anxiety

If you're building a content-heavy site, Astro 5 should be on your radar.
