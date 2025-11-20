# SEO & Analytics Setup Guide

This guide covers the complete setup for Google Search Console, Google Analytics 4, and SEO optimization for your portfolio site.

## Table of Contents

1. [Google Analytics 4 (GA4) Setup](#google-analytics-4-ga4-setup)
2. [Google Search Console Setup](#google-search-console-setup)
3. [Sitemap Configuration](#sitemap-configuration)
4. [SEO Features Implemented](#seo-features-implemented)
5. [Testing & Validation](#testing--validation)

---

## Google Analytics 4 (GA4) Setup

### Step 1: Create a GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon in bottom left)
3. In the **Property** column, click **Create Property**
4. Enter property details:
   - **Property name**: `Óscar Gallego Portfolio`
   - **Reporting time zone**: Your timezone
   - **Currency**: EUR
5. Click **Next** and complete the setup wizard
6. After creation, click **Data Streams** → **Add stream** → **Web**
7. Enter:
   - **Website URL**: `https://oscargallegoruiz.com`
   - **Stream name**: `Portfolio Production`
8. Click **Create stream**
9. **Copy the Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Add Measurement ID to Your Project

#### For Local Development:

Create a `.env` file in the project root:

```bash
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### For Vercel Deployment:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Key**: `PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (your actual Measurement ID)
   - **Environment**: Select **Production**, **Preview**, and **Development**
5. Click **Save**
6. Redeploy your site for changes to take effect

### Step 3: Verify GA4 is Working

1. Deploy your site with the environment variable set
2. Visit your live site
3. In GA4, go to **Reports** → **Realtime**
4. You should see your visit appear within 30 seconds
5. Check the browser console - you should NOT see any GA-related errors

**Note**: GA4 only loads in production mode. In development, you'll see a console message: "📊 Google Analytics is disabled in development mode"

---

## Google Search Console Setup

### Step 1: Add Your Property

1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Click **Add property**
3. Choose **URL prefix** (recommended)
4. Enter: `https://oscargallegoruiz.com`
5. Click **Continue**

### Step 2: Verify Ownership

You have several verification options. Here are the recommended methods:

#### Option A: HTML Tag Verification (Easiest)

1. In Search Console, select **HTML tag** method
2. Copy the meta tag provided (looks like: `<meta name="google-site-verification" content="xxxxx" />`)
3. Add it to your [Layout.astro](src/layouts/Layout.astro) in the `<head>` section:

```astro
<!-- Google Search Console Verification -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

4. Deploy your site
5. Return to Search Console and click **Verify**

#### Option B: DNS Verification (More Permanent)

1. In Search Console, select **DNS record** method
2. Copy the TXT record provided
3. Add it to your domain DNS settings:
   - **Type**: TXT
   - **Name**: @ (or leave blank for root domain)
   - **Value**: `google-site-verification=xxxxx`
   - **TTL**: 3600 (or default)
4. Wait for DNS propagation (5-30 minutes)
5. Return to Search Console and click **Verify**

### Step 3: Submit Your Sitemap

1. Once verified, in the left sidebar click **Sitemaps**
2. Enter: `sitemap-index.xml`
3. Click **Submit**

Your sitemap URL will be: `https://oscargallegoruiz.com/sitemap-index.xml`

### Step 4: Request Indexing for Important Pages

1. In the left sidebar, click **URL Inspection**
2. Enter these URLs one by one:
   - `https://oscargallegoruiz.com/`
   - `https://oscargallegoruiz.com/blog/`
   - Your blog post URLs
3. Click **Request Indexing** for each

This helps Google discover and index your content faster.

---

## Sitemap Configuration

### Current Sitemap Setup

The sitemap is automatically generated using `@astrojs/sitemap` with the following configuration:

#### Priority Levels:

- **Homepage** (`/`): Priority 1.0, changes monthly
- **Blog Index** (`/blog/`): Priority 0.9, changes weekly
- **Blog Posts** (`/blog/*`): Priority 0.8, changes monthly
- **Other Pages**: Priority 0.7, changes weekly

#### URLs Included:

- ✅ Homepage
- ✅ Blog index page
- ✅ All published blog posts
- ❌ Components page (filtered out)

### Viewing Your Sitemap

- **Sitemap Index**: https://oscargallegoruiz.com/sitemap-index.xml
- **Main Sitemap**: https://oscargallegoruiz.com/sitemap-0.xml
- **Robots.txt**: https://oscargallegoruiz.com/robots.txt

### Build and Check Sitemap Locally

```bash
# Build the site
npm run build

# Preview the production build
npm run preview

# Check the sitemap
cat dist/sitemap-0.xml | grep -o '<loc>[^<]*</loc>'
```

---

## SEO Features Implemented

### ✅ Meta Tags

#### All Pages:
- Title and description meta tags
- Canonical URLs
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Author and robots meta tags
- Theme color for mobile browsers
- Structured data (JSON-LD) for Person and Website

#### Blog Pages (Article-Specific):
- `og:type` set to "article"
- `article:published_time` and `article:modified_time`
- `article:author` and `article:section`
- Article-specific Open Graph images

### ✅ Structured Data (JSON-LD)

#### Homepage:
- Person schema (your profile)
- WebSite schema
- ProfilePage schema

#### Blog Index:
- Blog schema with list of blog posts
- BreadcrumbList schema

#### Blog Posts:
- BlogPosting schema with full article metadata
- BreadcrumbList schema for navigation
- Reading time and word count
- Author information with social links

### ✅ Sitemap Features

- Automatic generation on build
- Priority and change frequency per page type
- Filtered pages (excludes /components)
- Referenced in robots.txt

### ✅ Performance Optimizations

- **Partytown**: Third-party scripts (GA4) run in a web worker, not blocking main thread
- **Vercel Analytics**: Edge analytics with zero performance impact
- **Image Optimization**: All images use proper alt text and loading strategies

---

## Testing & Validation

### 1. Test Structured Data

#### Google Rich Results Test:
1. Go to: https://search.google.com/test/rich-results
2. Enter your page URL or paste HTML
3. Verify no errors for:
   - Homepage (Person, Website schemas)
   - Blog index (Blog, BreadcrumbList)
   - Blog posts (BlogPosting, BreadcrumbList)

#### Schema Markup Validator:
1. Go to: https://validator.schema.org/
2. Paste your page URL
3. Check for validation errors

### 2. Test Open Graph Tags

#### Facebook Sharing Debugger:
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your URL
3. Click **Scrape Again** to refresh cache
4. Verify image, title, and description appear correctly

#### Twitter Card Validator:
1. Go to: https://cards-dev.twitter.com/validator
2. Enter your URL
3. Verify card preview looks correct

### 3. Test Sitemap

```bash
# Validate sitemap XML structure
curl https://oscargallegoruiz.com/sitemap-index.xml | xmllint --format -

# Check all URLs are accessible
curl -s https://oscargallegoruiz.com/sitemap-0.xml | \
  grep -o '<loc>[^<]*</loc>' | \
  sed 's/<\/*loc>//g' | \
  xargs -I {} curl -o /dev/null -s -w "%{http_code} {}\n" {}
```

All URLs should return `200`.

### 4. Test Page Speed

#### PageSpeed Insights:
1. Go to: https://pagespeed.web.dev/
2. Enter: `https://oscargallegoruiz.com`
3. Aim for scores above 90 on:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

### 5. Mobile-Friendly Test

1. Go to: https://search.google.com/test/mobile-friendly
2. Enter your URL
3. Verify page is mobile-friendly

### 6. Check Robots.txt

Visit: https://oscargallegoruiz.com/robots.txt

Should contain:
```
User-agent: *
Allow: /
Sitemap: https://oscargallegoruiz.com/sitemap-index.xml
```

---

## Monitoring & Maintenance

### Google Search Console - Weekly Tasks

1. **Check Coverage Report**:
   - Go to **Coverage** report
   - Look for errors or warnings
   - Fix any indexing issues

2. **Review Performance**:
   - Check which queries bring traffic
   - Monitor click-through rates (CTR)
   - Identify pages with low CTR and improve meta descriptions

3. **Check Mobile Usability**:
   - Review mobile usability issues
   - Fix any mobile-specific problems

### Google Analytics 4 - Weekly Tasks

1. **Review Realtime**:
   - Check current active users
   - Monitor which pages are popular

2. **Check Acquisition**:
   - See where traffic comes from
   - Identify top channels (Organic Search, Direct, Referral, Social)

3. **Review Engagement**:
   - Check average engagement time
   - Review most popular content
   - Monitor bounce rate by page

### Monthly SEO Tasks

1. **Update old blog posts**:
   - Refresh content with new information
   - Update the `updatedDate` field
   - Improve internal linking

2. **Create new content**:
   - Write new blog posts targeting relevant keywords
   - Ensure proper heading structure (H1, H2, H3)
   - Add internal links to related posts

3. **Monitor Core Web Vitals**:
   - Check LCP (Largest Contentful Paint) < 2.5s
   - Check FID (First Input Delay) < 100ms
   - Check CLS (Cumulative Layout Shift) < 0.1

---

## Troubleshooting

### GA4 Not Tracking

1. Check environment variable is set in Vercel
2. Verify you're testing on production, not local dev
3. Open browser DevTools → Network tab, filter by "google"
4. You should see requests to `google-analytics.com`
5. Check for ad blockers (they may block GA4)

### Search Console "URL not found"

1. Wait 48-72 hours after submitting sitemap
2. Verify sitemap is accessible: https://oscargallegoruiz.com/sitemap-index.xml
3. Check robots.txt allows crawling: https://oscargallegoruiz.com/robots.txt
4. Request indexing manually via URL Inspection tool

### Structured Data Errors

1. Use Rich Results Test to identify specific errors
2. Check JSON-LD syntax in browser DevTools:
   - Open DevTools → Elements tab
   - Search for `application/ld+json`
   - Copy JSON and validate at https://jsonlint.com/
3. Common issues:
   - Missing required fields
   - Invalid date formats (use ISO 8601)
   - Incorrect URLs (must be absolute, not relative)

---

## Additional Resources

- [Google Search Console Help](https://support.google.com/webmasters/)
- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Schema.org Documentation](https://schema.org/)
- [Astro SEO Guide](https://docs.astro.build/en/guides/seo/)
- [Vercel Analytics Docs](https://vercel.com/docs/analytics)

---

## Summary Checklist

- [ ] Create GA4 property and get Measurement ID
- [ ] Add `PUBLIC_GA_MEASUREMENT_ID` to Vercel environment variables
- [ ] Verify ownership in Google Search Console
- [ ] Submit sitemap to Search Console
- [ ] Test structured data with Rich Results Test
- [ ] Validate Open Graph tags with Facebook Debugger
- [ ] Test mobile-friendliness
- [ ] Run PageSpeed Insights
- [ ] Request indexing for key pages
- [ ] Monitor Search Console weekly for issues
- [ ] Check GA4 reports for traffic insights

---

**Last Updated**: November 2025
