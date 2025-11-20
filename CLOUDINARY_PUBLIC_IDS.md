# 📋 Cloudinary Public IDs Reference

## How to Find Public IDs

1. **Click on any image** in your Cloudinary Media Library
2. Look for the **"Public ID"** field (usually at the top)
3. Copy the exact value

## Expected Public IDs

Based on your blog folder, you should have these public IDs:

| Image Description | Expected Public ID | Blog Posts |
|-------------------|-------------------|------------|
| 🚀 Astro 5 rocket (purple/blue) | `blog/astro-introduction` | introduccion-astro-5, introduction-astro-5 |
| 🎨 Tailwind CSS (code/performance) | `blog/tailwind-css-4` | tailwind-css-4-novedades, tailwind-css-4-news |
| 🛡️ TypeScript (blue shield) | `blog/typescript-best-practices` | typescript-mejores-practicas, typescript-best-practices |
| 🔍 Debugging (confused → aha!) | `blog/astro-debugging` | astro-ubicacion-content-config, astro-content-config-location |
| ✅❌ Tests (local vs Vercel) | `blog/vercel-tests` | tests-localmente-fallan-vercel, tests-pass-locally-fail-vercel |

## Quick Test URLs

Test if these URLs work in your browser:

1. **Astro 5**: https://res.cloudinary.com/dl0qx4iof/image/upload/blog/astro-introduction
2. **Tailwind**: https://res.cloudinary.com/dl0qx4iof/image/upload/blog/tailwind-css-4
3. **TypeScript**: https://res.cloudinary.com/dl0qx4iof/image/upload/blog/typescript-best-practices
4. **Debugging**: https://res.cloudinary.com/dl0qx4iof/image/upload/blog/astro-debugging
5. **Vercel Tests**: https://res.cloudinary.com/dl0qx4iof/image/upload/blog/vercel-tests

## If URLs Don't Work

The public IDs might be different. Common issues:

1. **Has file extension**: `blog/astro-introduction.png` → Should be `blog/astro-introduction`
2. **Wrong folder**: `astro-introduction` → Should be `blog/astro-introduction`
3. **Different naming**: You used different names when uploading

## How to Rename in Cloudinary

If the public IDs don't match:

1. Click on the image
2. Click the **three dots (⋮)** menu
3. Select **"Rename"**
4. Change to match the expected public ID (e.g., `blog/astro-introduction`)

## Next Step

Please try opening the test URLs above in your browser. Let me know which ones work and which ones give 404 errors, and I'll update the configuration accordingly.
