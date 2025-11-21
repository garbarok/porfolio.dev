/**
 * Cloudinary Image Utilities
 *
 * Provides helper functions for generating optimized Cloudinary URLs
 * with responsive transformations and format optimization.
 */

const CLOUDINARY_BASE_URL = import.meta.env.PUBLIC_CLOUDINARY_BASE_URL ||
  'https://res.cloudinary.com/dl0qx4iof/image/upload';

export interface CloudinaryOptions {
  /** Image width in pixels */
  width?: number;
  /** Image height in pixels */
  height?: number;
  /** Image quality (1-100, default: auto) */
  quality?: number | 'auto';
  /** Image format (default: auto) */
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  /** Crop/resize mode */
  crop?: 'fill' | 'fit' | 'scale' | 'limit' | 'pad';
  /** Apply transformations */
  transformations?: string[];
}

/**
 * Generates an optimized Cloudinary URL for an image
 *
 * @param publicId - The Cloudinary public ID (e.g., "blog/astro-introduction.png")
 * @param options - Transformation options
 * @returns Full Cloudinary URL with optimizations
 *
 * @example
 * ```ts
 * // Basic usage (no transformations, uses original)
 * getCloudinaryUrl('blog/astro-introduction.png')
 * // → https://res.cloudinary.com/.../blog/astro-introduction.png
 *
 * // With optimizations
 * getCloudinaryUrl('blog/astro-introduction.png', {
 *   width: 1200,
 *   quality: 'auto',
 *   format: 'auto'
 * })
 * // → https://res.cloudinary.com/.../w_1200,q_auto,f_auto/blog/astro-introduction.png
 * ```
 */
export function getCloudinaryUrl(
  publicId: string,
  options: CloudinaryOptions = {}
): string {
  const {
    width,
    height,
    quality,
    format,
    crop,
    transformations = [],
  } = options;

  const transforms: string[] = [];

  // Add custom transformations first
  if (transformations.length > 0) {
    transforms.push(...transformations);
  }

  // Build transformation string (only if options are provided)
  const params: string[] = [];

  if (width) params.push(`w_${width}`);
  if (height) params.push(`h_${height}`);
  if (crop) params.push(`c_${crop}`);
  if (quality) params.push(`q_${quality}`);
  if (format) params.push(`f_${format}`);

  if (params.length > 0) {
    transforms.push(params.join(','));
  }

  const transformString = transforms.length > 0 ? transforms.join('/') + '/' : '';

  return `${CLOUDINARY_BASE_URL}/${transformString}${publicId}`;
}

/**
 * Generates a responsive srcset for Cloudinary images
 *
 * @param publicId - The Cloudinary public ID
 * @param widths - Array of widths for srcset (default: [400, 800, 1200, 1600])
 * @param options - Additional Cloudinary options
 * @returns srcset string for responsive images
 *
 * @example
 * ```astro
 * <img
 *   src={getCloudinaryUrl('blog/image', { width: 1200 })}
 *   srcset={getCloudinarySrcset('blog/image')}
 *   sizes="(max-width: 768px) 100vw, 1200px"
 * />
 * ```
 */
export function getCloudinarySrcset(
  publicId: string,
  widths: number[] = [400, 800, 1200, 1600],
  options: Omit<CloudinaryOptions, 'width'> = {}
): string {
  return widths
    .map(width => {
      const url = getCloudinaryUrl(publicId, { ...options, width });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Blog image presets for consistent sizing
 *
 * Note: Default preset has no transformations - uses original image
 * Add transformations only when you need specific sizing/optimization
 */
export const BLOG_IMAGE_PRESETS = {
  /** Original image - no transformations (recommended for most uses) */
  original: {},
  /** Hero image for blog post headers (1200x630) */
  hero: {
    width: 1200,
    height: 630,
    crop: 'fill' as const,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
  /** Thumbnail for blog post cards (400x210) */
  thumbnail: {
    width: 400,
    height: 210,
    crop: 'fill' as const,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
  /** Open Graph / social sharing (1200x630) */
  og: {
    width: 1200,
    height: 630,
    crop: 'fill' as const,
    quality: 85 as const,
    format: 'jpg' as const,
  },
} as const;

/**
 * Get blog image URL with preset
 *
 * @example
 * ```ts
 * getBlogImageUrl('blog/astro-introduction', 'hero')
 * ```
 */
export function getBlogImageUrl(
  publicId: string,
  preset: keyof typeof BLOG_IMAGE_PRESETS
): string {
  return getCloudinaryUrl(publicId, BLOG_IMAGE_PRESETS[preset]);
}

/**
 * Blog image public IDs (central management)
 * Note: Don't include version numbers or file extensions - Cloudinary handles these automatically
 */
export const BLOG_IMAGES = {
  'ai-prompt-engineering-tips': 'blog/ai-prompt-engineering-tips.png',
  'astro-content-config-location': 'blog/astro-debugging.png',
  'astro-ubicacion-content-config': 'blog/astro-debugging.png',
  'consejos-ingenieria-prompts-ai': 'blog/ai-prompt-engineering-tips.png',
  'introduccion-astro-5': 'blog/astro-introduction.png',
  'introduction-astro-5': 'blog/astro-introduction.png',
  'tailwind-css-4-news': 'blog/tailwind-css-4.png',
  'tailwind-css-4-novedades': 'blog/tailwind-css-4.png',
  'tests-localmente-fallan-vercel': 'blog/vercel-tests.png',
  'tests-pass-locally-fail-vercel': 'blog/vercel-tests.png',
  'typescript-best-practices': 'blog/typescript-best-practices.png',
  'typescript-mejores-practicas': 'blog/typescript-best-practices.png',
} as const;

/**
 * Get blog post image by slug
 *
 * @example
 * ```ts
 * // Get original image (no transformations)
 * const imageUrl = getBlogPostImage('introduccion-astro-5')
 * // → https://res.cloudinary.com/.../blog/astro-introduction.png
 *
 * // Get with hero preset (resized)
 * const heroUrl = getBlogPostImage('introduccion-astro-5', 'hero')
 * // → https://res.cloudinary.com/.../w_1200,h_630,.../blog/astro-introduction.png
 * ```
 */
export function getBlogPostImage(
  slug: string,
  preset: keyof typeof BLOG_IMAGE_PRESETS = 'original'
): string {
  const publicId = BLOG_IMAGES[slug as keyof typeof BLOG_IMAGES];

  if (!publicId) {
    console.warn(`No Cloudinary image found for slug: ${slug}`);
    return '/placeholder.jpg'; // Fallback
  }

  return getBlogImageUrl(publicId, preset);
}
