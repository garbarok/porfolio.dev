/**
 * Check Cloudinary Images Script
 *
 * Verifies that all blog images referenced in BLOG_IMAGES
 * exist and are accessible on Cloudinary.
 */

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dl0qx4iof/image/upload';

// Blog images mapping (duplicated from cloudinary.ts for Node environment)
const BLOG_IMAGES = {
  'introduccion-astro-5': 'blog/astro-introduction.png',
  'introduction-astro-5': 'blog/astro-introduction.png',
  'tailwind-css-4-novedades': 'blog/tailwind-css-4.png',
  'tailwind-css-4-news': 'blog/tailwind-css-4.png',
  'typescript-mejores-practicas': 'blog/typescript-best-practices.png',
  'typescript-best-practices': 'blog/typescript-best-practices.png',
  'astro-ubicacion-content-config': 'blog/astro-debugging.png',
  'astro-content-config-location': 'blog/astro-debugging.png',
  'tests-localmente-fallan-vercel': 'blog/vercel-tests.png',
  'tests-pass-locally-fail-vercel': 'blog/vercel-tests.png',
} as const;

async function checkImage(publicId: string): Promise<boolean> {
  const url = `${CLOUDINARY_BASE}/${publicId}`;

  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking Cloudinary images...\n');

  const entries = Object.entries(BLOG_IMAGES);
  const results: { slug: string; publicId: string; exists: boolean }[] = [];

  for (const [slug, publicId] of entries) {
    const exists = await checkImage(publicId);
    results.push({ slug, publicId, exists });

    const icon = exists ? '✅' : '❌';
    console.log(`${icon} ${slug}`);
    console.log(`   → ${publicId}\n`);
  }

  const missing = results.filter(r => !r.exists);

  if (missing.length > 0) {
    console.log('\n⚠️  Missing images:');
    console.log('\nUpload these images to Cloudinary:');

    const uploadMap: Record<string, string> = {
      'blog/astro-introduction.png': 'public/astro-introduction.png',
      'blog/tailwind-css-4.png': 'public/Tailwind.png',
      'blog/typescript-best-practices.png': 'public/TypeScript.png',
      'blog/astro-debugging.png': 'public/Debugging.png',
      'blog/vercel-tests.png': 'public/TestsVercel.png',
    };

    missing.forEach(({ publicId }) => {
      const localFile = uploadMap[publicId];
      if (localFile) {
        console.log(`\n📤 ${publicId}`);
        console.log(`   File: ${localFile}`);
        console.log(`   Cloudinary Dashboard: https://console.cloudinary.com/`);
      }
    });

    console.log('\n💡 See CLOUDINARY_SETUP.md for upload instructions');
  } else {
    console.log('\n✅ All images are available on Cloudinary!');
  }
}

main().catch(console.error);
