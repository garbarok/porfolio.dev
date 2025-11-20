# 🎨 Cloudinary Usage Examples

## Quick Reference

All your blog images are now hosted on Cloudinary with clean, simple URLs:

```
https://res.cloudinary.com/dl0qx4iof/image/upload/blog/astro-introduction.png
https://res.cloudinary.com/dl0qx4iof/image/upload/blog/tailwind-css-4.png
https://res.cloudinary.com/dl0qx4iof/image/upload/blog/typescript-best-practices.png
https://res.cloudinary.com/dl0qx4iof/image/upload/blog/astro-debugging.png
https://res.cloudinary.com/dl0qx4iof/image/upload/blog/vercel-tests.png
```

## 🚀 Usage Methods

### Method 1: Using BlogImage Component (Recommended)

```astro
---
import BlogImage from '@/components/BlogImage.astro';
---

<!-- Original image - clean URL, no transformations -->
<BlogImage
  slug="introduccion-astro-5"
  alt="Astro 5 framework illustration"
/>
<!-- Generates: https://res.cloudinary.com/.../blog/astro-introduction.png -->

<!-- With hero preset - resized and optimized -->
<BlogImage
  slug="tailwind-css-4-novedades"
  alt="Tailwind CSS 4 performance"
  preset="hero"
/>
<!-- Generates: https://res.cloudinary.com/.../w_1200,h_630,.../blog/tailwind-css-4.png -->

<!-- Thumbnail for cards -->
<BlogImage
  slug="typescript-mejores-practicas"
  alt="TypeScript best practices"
  preset="thumbnail"
  loading="lazy"
/>
```

### Method 2: Using Utility Functions

```astro
---
import { getBlogPostImage } from '@/utils/cloudinary';

// Get original image URL (clean, no transformations)
const imageUrl = getBlogPostImage('introduccion-astro-5');
// → https://res.cloudinary.com/.../blog/astro-introduction.png

// Get optimized hero image
const heroUrl = getBlogPostImage('tailwind-css-4-novedades', 'hero');
// → https://res.cloudinary.com/.../w_1200,h_630,.../blog/tailwind-css-4.png

// Get Open Graph image (for social sharing)
const ogImage = getBlogPostImage('typescript-mejores-practicas', 'og');
---

<img src={imageUrl} alt="Blog post" />
<meta property="og:image" content={ogImage} />
```

### Method 3: Direct URL (Hardcoded)

```astro
<!-- Simple, clean URL -->
<img
  src="https://res.cloudinary.com/dl0qx4iof/image/upload/blog/vercel-tests.png"
  alt="Vercel CI tests"
/>
```

## 📝 Blog Post Integration

### Example: Blog Post Layout

```astro
---
// src/layouts/BlogPost.astro
import { getBlogPostImage } from '@/utils/cloudinary';
import BlogImage from '@/components/BlogImage.astro';

const { data, slug } = Astro.props;

// Extract slug without language prefix
const postSlug = slug.replace(/^(en|es)\//, '');

// Get images for different uses
const heroImage = getBlogPostImage(postSlug, 'original');
const ogImage = getBlogPostImage(postSlug, 'og');
---

<!DOCTYPE html>
<html>
  <head>
    <title>{data.title}</title>

    <!-- Open Graph meta tags -->
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={ogImage} />
  </head>

  <body>
    <article>
      <!-- Hero image -->
      <BlogImage
        slug={postSlug}
        alt={data.image?.alt || data.title}
        loading="eager"
      />

      <h1>{data.title}</h1>
      <p>{data.description}</p>

      <slot />
    </article>
  </body>
</html>
```

### Example: Blog Card List

```astro
---
import { getCollection } from 'astro:content';
import BlogImage from '@/components/BlogImage.astro';

const posts = await getCollection('blog', ({ data }) => !data.draft);
---

<div class="blog-grid">
  {posts.map(post => {
    const postSlug = post.slug.replace(/^(en|es)\//, '');

    return (
      <article class="blog-card">
        <a href={`/blog/${postSlug}`}>
          <!-- Thumbnail preset for cards -->
          <BlogImage
            slug={postSlug}
            alt={post.data.image?.alt || post.data.title}
            preset="thumbnail"
            loading="lazy"
          />

          <h2>{post.data.title}</h2>
          <p>{post.data.description}</p>
        </a>
      </article>
    );
  })}
</div>
```

## 🎯 Available Presets

| Preset | URL Example | Use Case |
|--------|-------------|----------|
| `original` (default) | `/blog/image.png` | Clean URL, no transformations |
| `hero` | `/w_1200,h_630,.../blog/image.png` | Blog post headers |
| `thumbnail` | `/w_400,h_210,.../blog/image.png` | Blog cards, listings |
| `og` | `/w_1200,h_630,.../blog/image.png` | Social sharing (OG, Twitter) |

## 🛠️ Custom Transformations

Need custom sizes? Use `getCloudinaryUrl` directly:

```typescript
import { getCloudinaryUrl } from '@/utils/cloudinary';

// Custom size
const customUrl = getCloudinaryUrl('blog/astro-introduction.png', {
  width: 800,
  height: 400,
  crop: 'fill',
  quality: 'auto',
  format: 'webp'
});
// → https://res.cloudinary.com/.../w_800,h_400,c_fill,q_auto,f_webp/blog/astro-introduction.png

// Multiple transformations
const advancedUrl = getCloudinaryUrl('blog/tailwind-css-4.png', {
  width: 600,
  quality: 90,
  format: 'avif',
  transformations: ['e_sharpen:100', 'e_brightness:10']
});
```

## 📋 Image Slug Mapping

Your blog posts use these slugs (automatically mapped to Cloudinary):

| Blog Post Slug | Cloudinary Image |
|----------------|------------------|
| `introduccion-astro-5` | `blog/astro-introduction.png` |
| `introduction-astro-5` | `blog/astro-introduction.png` |
| `tailwind-css-4-novedades` | `blog/tailwind-css-4.png` |
| `tailwind-css-4-news` | `blog/tailwind-css-4.png` |
| `typescript-mejores-practicas` | `blog/typescript-best-practices.png` |
| `typescript-best-practices` | `blog/typescript-best-practices.png` |
| `astro-ubicacion-content-config` | `blog/astro-debugging.png` |
| `astro-content-config-location` | `blog/astro-debugging.png` |
| `tests-localmente-fallan-vercel` | `blog/vercel-tests.png` |
| `tests-pass-locally-fail-vercel` | `blog/vercel-tests.png` |

## ✅ Benefits

- **Clean URLs by default** - No transformations unless needed
- **Automatic optimization** - Cloudinary handles WebP/AVIF conversion
- **CDN delivery** - Fast worldwide
- **No build impact** - Images don't bloat your bundle
- **Easy to update** - Change images without redeploying
- **Type-safe** - TypeScript autocomplete for slugs

## 🔍 Testing

Verify all images are accessible:

```bash
pnpm run check:images
```

Should output:
```
✅ All images are available on Cloudinary!
```

## 📚 More Information

- [QUICK_START_CLOUDINARY.md](QUICK_START_CLOUDINARY.md) - Quick setup guide
- [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md) - Detailed documentation
- [src/utils/cloudinary.ts](src/utils/cloudinary.ts) - Utility functions
- [src/components/BlogImage.astro](src/components/BlogImage.astro) - Image component
