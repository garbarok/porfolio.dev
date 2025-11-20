# 🚀 Quick Start: Upload Blog Images to Cloudinary

## Step 1: Upload Images to Cloudinary

You have your images ready in the `public/` folder. Now upload them to Cloudinary:

### Via Cloudinary Dashboard (Easiest)

1. **Go to [Cloudinary Media Library](https://console.cloudinary.com/console/c-1fc46b3d99b0b1bdc3fd21eaacc59f/media_library/folders/home)**

2. **Create a `blog` folder** (if it doesn't exist)

3. **Upload and rename each image:**

| Local File | Upload As | Cloudinary Public ID |
|------------|-----------|---------------------|
| `public/astro-introduction.png` | `astro-introduction.png` | `blog/astro-introduction` |
| `public/Tailwind.png` | `tailwind-css-4.png` | `blog/tailwind-css-4` |
| `public/TypeScript.png` | `typescript-best-practices.png` | `blog/typescript-best-practices` |
| `public/Debugging.png` | `astro-debugging.png` | `blog/astro-debugging` |
| `public/TestsVercel.png` | `vercel-tests.png` | `blog/vercel-tests` |

**Important:** Make sure the folder is named `blog` and the files are renamed exactly as shown above.

---

## Step 2: Verify Images

Run the check script to verify all images are accessible:

```bash
pnpm run check:images
```

You should see:

```
✅ introduccion-astro-5
   → blog/astro-introduction

✅ tailwind-css-4-novedades
   → blog/tailwind-css-4

✅ typescript-mejores-practicas
   → blog/typescript-best-practices

✅ astro-ubicacion-content-config
   → blog/astro-debugging

✅ tests-localmente-fallan-vercel
   → blog/vercel-tests

✅ All images are available on Cloudinary!
```

---

## Step 3: Update Blog Posts (Optional)

Your blog posts currently reference local images in `public/`. You have two options:

### Option A: Keep current frontmatter, use component

Keep your current frontmatter as-is, and use the new component in your blog layout:

```astro
---
import BlogImage from '@/components/BlogImage.astro';
import { getBlogPostImage } from '@/utils/cloudinary';

const { data, slug } = Astro.props;

// Extract slug from full path (e.g., "es/introduccion-astro-5" → "introduccion-astro-5")
const postSlug = slug.split('/').pop();
---

<article>
  <!-- Hero image from Cloudinary -->
  <BlogImage
    slug={postSlug}
    alt={data.image?.alt || data.title}
    preset="hero"
    loading="eager"
  />

  <h1>{data.title}</h1>
  <!-- rest of your content -->
</article>
```

### Option B: Update frontmatter to use Cloudinary directly

Update each blog post's frontmatter:

**Before:**
```markdown
---
image:
  url: "/projects/snapcompress.webp"
  alt: "Astro 5 logo"
---
```

**After:**
```markdown
---
image:
  cloudinarySlug: "introduccion-astro-5"
  alt: "Astro 5 logo"
---
```

---

## Step 4: Clean Up Public Folder

Once Cloudinary is working, remove the local images:

```bash
rm public/astro-introduction.png
rm public/Tailwind.png
rm public/TypeScript.png
rm public/Debugging.png
rm public/TestsVercel.png
```

---

## 🎯 Usage Examples

### In Blog Layout

```astro
---
import BlogImage from '@/components/BlogImage.astro';

const { data, slug } = Astro.props;
const postSlug = slug.replace(/^(en|es)\//, ''); // Remove language prefix
---

<!-- Hero image -->
<BlogImage
  slug={postSlug}
  alt={data.image?.alt || data.title}
  preset="hero"
  loading="eager"
/>
```

### For Blog Listings/Cards

```astro
---
import BlogImage from '@/components/BlogImage.astro';

const posts = await getCollection('blog');
---

{posts.map(post => (
  <article>
    <BlogImage
      slug={post.slug.replace(/^(en|es)\//, '')}
      alt={post.data.image?.alt}
      preset="thumbnail"
      loading="lazy"
    />
    <h2>{post.data.title}</h2>
  </article>
))}
```

### Direct URL (for OG images, etc.)

```astro
---
import { getBlogPostImage } from '@/utils/cloudinary';

const ogImage = getBlogPostImage('introduccion-astro-5', 'og');
---

<meta property="og:image" content={ogImage} />
```

---

## ✅ Benefits You Get

- ✅ **Automatic WebP/AVIF conversion** - Modern formats for better performance
- ✅ **Responsive images** - Automatic srcset with multiple sizes
- ✅ **CDN delivery** - Fast loading worldwide
- ✅ **No build impact** - Images don't bloat your bundle
- ✅ **Easy updates** - Change images without redeploying
- ✅ **Lazy loading** - Better performance with automatic lazy loading

---

## 🆘 Troubleshooting

**Images not loading?**

1. Check the public IDs match exactly in Cloudinary
2. Run `pnpm run check:images` to verify
3. Check the browser console for 404 errors
4. Verify folder structure: `blog/image-name` not just `image-name`

**Need different transformations?**

Edit [src/utils/cloudinary.ts](src/utils/cloudinary.ts) and adjust the presets:

```typescript
export const BLOG_IMAGE_PRESETS = {
  hero: {
    width: 1200,
    height: 630,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  },
  // Add your own presets here
}
```

---

## 📚 Next Steps

- See [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md) for detailed documentation
- Check [src/utils/cloudinary.ts](src/utils/cloudinary.ts) for utility functions
- Use [BlogImage.astro](src/components/BlogImage.astro) component for easy integration
