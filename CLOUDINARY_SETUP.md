# 🖼️ Cloudinary Image Management Guide

This project uses Cloudinary for optimized image delivery with automatic format conversion, responsive images, and CDN caching.

## 📁 Current Setup

### Environment Variables

```bash
PUBLIC_CLOUDINARY_CLOUD_NAME=dl0qx4iof
PUBLIC_CLOUDINARY_BASE_URL=https://res.cloudinary.com/dl0qx4iof/image/upload
```

### Image Structure in Cloudinary

All blog images should be uploaded to the `blog/` folder with these public IDs:

```
blog/
├── astro-introduction.png
├── tailwind-css-4.png
├── typescript-best-practices.png
├── astro-debugging.png
└── vercel-tests.png
```

## 🚀 Upload Images to Cloudinary

### Option 1: Via Cloudinary Dashboard (Recommended)

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Navigate to **Media Library**
3. Create a folder named `blog`
4. Upload your images with these names:
   - `astro-introduction.png` → From `public/astro-introduction.png`
   - `tailwind-css-4.png` → From `public/Tailwind.png`
   - `typescript-best-practices.png` → From `public/TypeScript.png`
   - `astro-debugging.png` → From `public/Debugging.png`
   - `vercel-tests.png` → From `public/TestsVercel.png`

### Option 2: Via Cloudinary Upload API

```bash
# Install Cloudinary CLI
pnpm add -g cloudinary-cli

# Login
cld config

# Upload images
cld uploader upload public/astro-introduction.png --public_id blog/astro-introduction
cld uploader upload public/Tailwind.png --public_id blog/tailwind-css-4
cld uploader upload public/TypeScript.png --public_id blog/typescript-best-practices
cld uploader upload public/Debugging.png --public_id blog/astro-debugging
cld uploader upload public/TestsVercel.png --public_id blog/vercel-tests
```

### Option 3: Bulk Upload Script

Create `scripts/upload-to-cloudinary.js`:

```javascript
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: 'dl0qx4iof',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET'
});

const uploads = [
  { file: 'astro-introduction.png', publicId: 'blog/astro-introduction' },
  { file: 'Tailwind.png', publicId: 'blog/tailwind-css-4' },
  { file: 'TypeScript.png', publicId: 'blog/typescript-best-practices' },
  { file: 'Debugging.png', publicId: 'blog/astro-debugging' },
  { file: 'TestsVercel.png', publicId: 'blog/vercel-tests' }
];

async function uploadImages() {
  for (const { file, publicId } of uploads) {
    const filePath = path.join(process.cwd(), 'public', file);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        folder: 'blog',
        overwrite: true,
        resource_type: 'image'
      });
      console.log(`✅ Uploaded: ${publicId}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error);
    }
  }
}

uploadImages();
```

Run with: `node scripts/upload-to-cloudinary.js`

## 🎨 Usage Examples

### In Astro Components

```astro
---
import BlogImage from '@/components/BlogImage.astro';
---

<!-- Hero image for blog post -->
<BlogImage
  slug="introduccion-astro-5"
  alt="Astro 5 framework illustration"
  preset="hero"
  loading="eager"
/>

<!-- Thumbnail for blog card -->
<BlogImage
  slug="tailwind-css-4-novedades"
  alt="Tailwind CSS 4 performance"
  preset="thumbnail"
  loading="lazy"
/>
```

### Direct Utility Usage

```typescript
import { getBlogPostImage, getCloudinaryUrl } from '@/utils/cloudinary';

// Get optimized blog image
const heroUrl = getBlogPostImage('typescript-best-practices', 'hero');

// Custom transformations
const customUrl = getCloudinaryUrl('blog/astro-introduction', {
  width: 800,
  height: 400,
  quality: 80,
  format: 'webp',
  crop: 'fill'
});
```

### In Content Collections

Update your blog posts to reference Cloudinary URLs:

```markdown
---
title: "Introducción a Astro 5"
image:
  cloudinarySlug: "introduccion-astro-5"  # Uses BLOG_IMAGES mapping
  alt: "Astro 5 logo"
---
```

## 🔧 Update Blog Posts

You have two options:

### Option A: Use Cloudinary URLs directly in frontmatter

```markdown
---
image:
  url: "https://res.cloudinary.com/dl0qx4iof/image/upload/f_auto,q_auto/blog/astro-introduction"
  alt: "Astro 5 logo"
---
```

### Option B: Use slug-based mapping (Recommended)

Update `src/content.config.ts`:

```typescript
const blog = defineCollection({
  schema: z.object({
    // ...other fields
    image: z.object({
      cloudinarySlug: z.string().optional(), // Slug for Cloudinary lookup
      url: z.string().optional(),             // Fallback URL
      alt: z.string(),
    }).optional(),
  }),
});
```

Then in your blog layout:

```astro
---
import { getBlogPostImage } from '@/utils/cloudinary';

const { data } = Astro.props;
const imageUrl = data.image?.cloudinarySlug
  ? getBlogPostImage(data.image.cloudinarySlug, 'hero')
  : data.image?.url;
---

<img src={imageUrl} alt={data.image?.alt} />
```

## 📊 Image Presets

The project includes three presets:

| Preset | Size | Use Case |
|--------|------|----------|
| `hero` | 1200x630 | Blog post headers |
| `thumbnail` | 400x210 | Blog post cards/listings |
| `og` | 1200x630 | Open Graph / social sharing |

## 🗑️ Cleanup Public Folder

Once images are uploaded to Cloudinary, you can remove them from `public/`:

```bash
rm public/astro-introduction.png
rm public/Tailwind.png
rm public/TypeScript.png
rm public/Debugging.png
rm public/TestsVercel.png
```

Keep only:
- `public/favicon.svg`
- `public/projects/` (if used elsewhere)

## 🌐 Benefits of Cloudinary

- ✅ **Automatic Optimization**: WebP/AVIF conversion, quality optimization
- ✅ **Responsive Images**: Automatic srcset generation
- ✅ **CDN Delivery**: Fast worldwide with edge caching
- ✅ **No Build Impact**: Images don't increase bundle size
- ✅ **Easy Updates**: Change images without redeploying
- ✅ **Transformations**: On-the-fly resizing, cropping, effects

## 🔗 Resources

- [Cloudinary Console](https://console.cloudinary.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Image Transformation Reference](https://cloudinary.com/documentation/image_transformations)
