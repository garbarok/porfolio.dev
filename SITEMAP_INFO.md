# 🗺️ Sitemap Generation Documentation

## Overview

Your Astro project automatically generates a sitemap using the official `@astrojs/sitemap` integration with full i18n (internationalization) support for Spanish and English content.

## Configuration

### Location
File: [astro.config.mjs](astro.config.mjs)

### Setup
```javascript
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://oscargallegoruiz.com/",

  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: {
          es: "es",
          en: "en",
        },
      },
    }),
  ],
});
```

## Generated Files

After running `npm run build`, the sitemap is generated in the `dist/` folder:

```
dist/
├── sitemap-index.xml    # Main sitemap index
└── sitemap-0.xml        # Actual sitemap with all URLs
```

### 1. Sitemap Index (`sitemap-index.xml`)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://oscargallegoruiz.com/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>
```

### 2. Main Sitemap (`sitemap-0.xml`)
Contains all your pages with proper i18n alternate links.

## Current Sitemap Content

### Main Pages (with i18n)
✅ **Homepage**
- Spanish: `https://oscargallegoruiz.com/`
- English: `https://oscargallegoruiz.com/en/`
- Has `<xhtml:link>` alternate language tags

✅ **Blog Index**
- Spanish: `https://oscargallegoruiz.com/blog/`
- English: `https://oscargallegoruiz.com/en/blog/`
- Has `<xhtml:link>` alternate language tags

✅ **Contact Page**
- Spanish: `https://oscargallegoruiz.com/contact/`
- English: `https://oscargallegoruiz.com/en/contact/`
- Has `<xhtml:link>` alternate language tags

### Blog Posts (Spanish)
```
✅ /blog/astro-ubicacion-content-config/
✅ /blog/introduccion-astro-5/
✅ /blog/tailwind-css-4-novedades/
✅ /blog/tests-localmente-fallan-vercel/
✅ /blog/typescript-mejores-practicas/
```

### Blog Posts (English)
```
✅ /en/blog/astro-content-config-location/
✅ /en/blog/introduction-astro-5/
✅ /en/blog/tailwind-css-4-news/
✅ /en/blog/tests-pass-locally-fail-vercel/
✅ /en/blog/typescript-best-practices/
```

### Other Pages
```
✅ /components/  (Component showcase page)
```

## How It Works

### 1. Automatic Discovery
The `@astrojs/sitemap` integration automatically:
- Scans all pages in your `src/pages/` directory
- Includes Content Collection routes (blog posts)
- Generates URLs based on file structure
- Respects your i18n configuration

### 2. i18n Support
For pages with multiple languages, the sitemap includes:
```xml
<url>
  <loc>https://oscargallegoruiz.com/</loc>
  <xhtml:link rel="alternate" hreflang="es" href="https://oscargallegoruiz.com/"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://oscargallegoruiz.com/en/"/>
</url>
```

This tells search engines:
- ✅ This page exists in multiple languages
- ✅ ES is the default (no prefix)
- ✅ EN has `/en/` prefix
- ✅ Each version is an alternate of the other

### 3. Build Process
```bash
# Sitemap is generated during build
npm run build

# Output location
dist/sitemap-index.xml
dist/sitemap-0.xml
```

## SEO Benefits

### ✅ What the Sitemap Provides

1. **Complete Site Structure** - Search engines know all your pages
2. **Language Discovery** - Google understands your multilingual content
3. **Fresh Content** - New blog posts are automatically included
4. **Proper Hreflang** - Prevents duplicate content issues between languages

### 📊 Coverage Summary

| Type | Spanish (ES) | English (EN) | Total |
|------|--------------|--------------|-------|
| Main Pages | 3 | 3 | 6 |
| Blog Posts | 5 | 5 | 10 |
| Other | 1 | 0 | 1 |
| **Total** | **9** | **8** | **17 URLs** |

## Submitting to Search Engines

### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (oscargallegoruiz.com)
3. Navigate to **Sitemaps** in left sidebar
4. Add: `https://oscargallegoruiz.com/sitemap-index.xml`
5. Click Submit

### Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Select your site
3. Navigate to **Sitemaps**
4. Add: `https://oscargallegoruiz.com/sitemap-index.xml`
5. Click Submit

## Robots.txt Integration

Your site also has `astro-robots-txt` integration, which automatically creates:

```txt
# /robots.txt
User-agent: *
Allow: /

Sitemap: https://oscargallegoruiz.com/sitemap-index.xml
```

This tells search engines where to find your sitemap.

## Verification

### Check Sitemap After Build
```bash
# Build the site
npm run build

# View sitemap index
cat dist/sitemap-index.xml

# View main sitemap
cat dist/sitemap-0.xml

# Pretty print (requires xmllint)
xmllint --format dist/sitemap-0.xml | less
```

### Test Sitemap Online
After deployment, verify at:
- https://oscargallegoruiz.com/sitemap-index.xml
- https://oscargallegoruiz.com/sitemap-0.xml

### Validate Sitemap
Use [Google's Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

## Adding New Content

### Blog Posts
When you add a new blog post in `src/content/blog/`, it's **automatically included** in the next build. No configuration needed!

Example: If you create `src/content/blog/es/nuevo-post.md`, it will appear as:
```
https://oscargallegoruiz.com/blog/nuevo-post/
```

### New Pages
Create a new page in `src/pages/`, and it's automatically included:

```bash
# Create new page
src/pages/about.astro  →  https://oscargallegoruiz.com/about/

# With i18n
src/pages/en/about.astro  →  https://oscargallegoruiz.com/en/about/
```

## Advanced Configuration

### Exclude Pages from Sitemap
If you need to exclude certain pages:

```javascript
// astro.config.mjs
sitemap({
  filter: (page) => !page.includes('/draft/'),
  i18n: {
    defaultLocale: "es",
    locales: {
      es: "es",
      en: "en",
    },
  },
}),
```

### Custom Priority and Change Frequency
```javascript
sitemap({
  customPages: [
    'https://oscargallegoruiz.com/special-page',
  ],
  i18n: { /* ... */ },
}),
```

## Troubleshooting

### Sitemap not updating?
```bash
# Clear cache and rebuild
rm -rf dist/ .astro/
npm run build
```

### Missing blog posts?
- Check that posts have `draft: false` in frontmatter
- Verify posts are in `src/content/blog/`
- Ensure build completed without errors

### Wrong URLs?
- Check `site` in `astro.config.mjs` matches your domain
- Verify i18n routing configuration
- Check page file structure matches expected URLs

## Resources

- [Astro Sitemap Docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Hreflang Best Practices](https://developers.google.com/search/docs/specialty/international/localized-versions)

---

**Status:** ✅ Sitemap is properly configured and generating correctly with full i18n support for 17 URLs across ES/EN languages.
