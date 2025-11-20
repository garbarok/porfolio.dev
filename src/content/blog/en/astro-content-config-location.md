---
title: "Astro Content Collections: Why Your Schema Fields Are Missing"
description: "Debugging guide: How incorrect content config file location causes schema fields to disappear in Astro 5 projects."
pubDate: 2025-11-18
author: "Óscar Gallego"
tags: ["astro", "debugging", "content collections", "typescript"]
draft: false
relatedSlug: "astro-ubicacion-content-config"
image:
  url: "https://res.cloudinary.com/dl0qx4iof/image/upload/blog/astro-debugging.png"
  alt: "Debugging Astro - developer solving configuration issues"
---

## The Mystery of the Disappearing Schema Fields

While implementing multilingual support for my blog, I encountered a frustrating issue: **custom schema fields were missing from my content collections** despite being clearly defined in the schema and present in the frontmatter.

### The Symptoms

Here's what I was experiencing:

```typescript
// src/content/config.ts
const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/blog"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // ... other fields
    translation: z.string().optional(), // ❌ This field was missing!
  }),
});
```

**The problem:**
- ✅ Field defined in schema: `translation: z.string().optional()`
- ✅ Field present in frontmatter: `translation: "spanish-version"`
- ❌ Field missing in TypeScript types
- ❌ Field missing at runtime: `'translation' in post.data` returned `false`

### The Investigation

I initially thought this was an Astro 5.16.0 bug where optional fields were being stripped. I tested multiple approaches:

**Attempt 1: Use `.default()` instead of `.optional()`**
```typescript
translation: z.string().default("") // ❌ Still missing!
```

**Attempt 2: Make it required**
```typescript
translation: z.string() // ❌ Still missing!
```

**Attempt 3: Change the field name**
```typescript
relatedSlug: z.string() // ❌ Still missing!
```

Nothing worked. Even **required fields** were being stripped!

### The Root Cause

After extensive debugging, I discovered the issue: **I was editing the wrong config file**.

```bash
# What I had:
src/content/config.ts        ❌ WRONG location (being edited)
src/content.config.ts         ✅ CORRECT location (being used by Astro)
```

According to the [Astro documentation](https://docs.astro.build/en/guides/content-collections/), the content config file must be:

- **File name:** `content.config.ts` (not just `config.ts`)
- **Location:** `src/content.config.ts` (in the `src` root, NOT inside the `content` folder)

### Why This Happened

I had inadvertently created a duplicate config file in the wrong location:

```
src/
├── content/
│   ├── blog/
│   └── config.ts          ❌ I was editing this
└── content.config.ts      ✅ Astro was using this
```

When I updated `src/content/config.ts`, Astro ignored it completely because it only reads from `src/content.config.ts`.

### The Solution

**Step 1: Verify the correct file location**

```bash
# Check which file exists
ls -la src/content*.ts

# Should return:
# src/content.config.ts  ✅ This is correct
```

**Step 2: Remove duplicate config files**

```bash
# If you have a duplicate, remove it
rm src/content/config.ts
```

**Step 3: Update the CORRECT file**

```typescript
// src/content.config.ts ✅
import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/blog"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    relatedSlug: z.string(), // ✅ Now it works!
  }),
});

export const collections = { blog };
```

**Step 4: Clear the Astro cache and rebuild**

```bash
rm -rf .astro
npm run build
```

### Verification

After fixing the file location, everything worked perfectly:

```typescript
// Now this works! ✅
const posts = await getCollection('blog');
const currentPost = posts.find(/* ... */);

// Field is accessible
const relatedSlug = currentPost.data.relatedSlug; // ✅ Works!

// TypeScript types are correct
// No more "Property 'relatedSlug' does not exist" errors
```

### Key Takeaways

1. **File naming matters:** Use `content.config.ts`, not `config.ts`
2. **Location matters:** Place it in `src/` root, not inside `src/content/`
3. **Check for duplicates:** Look for conflicting config files
4. **Clear the cache:** Always run `rm -rf .astro` after major config changes
5. **Verify the import path:** Astro's type definitions reference `src/content.config.js`

### How to Avoid This Issue

**1. Use the correct Astro conventions:**
```bash
# Correct content config location
src/content.config.ts        ✅

# NOT these locations:
src/content/config.ts        ❌
src/contentConfig.ts         ❌
content.config.ts            ❌
```

**2. Check the generated types:**
```typescript
// .astro/content.d.ts should reference:
export type ContentConfig = typeof import("../src/content.config.js");
//                                          ^^^^^^^^^^^^^^^^^^
// If this path is wrong, you're editing the wrong file!
```

**3. Watch for TypeScript errors:**
If you see "Property does not exist" errors for fields you KNOW you defined, check your config file location before assuming it's an Astro bug.

## Real-World Implementation

Here's how I use this for multilingual blog posts:

**Frontmatter (English version):**
```markdown
---
title: "Introduction to Astro 5"
relatedSlug: "introduccion-astro-5"  # Spanish version slug
---
```

**Frontmatter (Spanish version):**
```markdown
---
title: "Introducción a Astro 5"
relatedSlug: "introduction-astro-5"  # English version slug
---
```

**Language switcher implementation:**
```typescript
// src/i18n/utils.ts
export async function getTranslatedBlogPath(
  currentSlug: string,
  currentLang: Language,
  targetLang: Language
): Promise<string | null> {
  const { getCollection } = await import('astro:content');
  const posts = await getCollection('blog');

  const currentPost = posts.find(post => {
    const slug = post.id.replace(/^(en|es)\//, '');
    return slug === currentSlug && post.id.startsWith(`${currentLang}/`);
  });

  if (!currentPost?.data.relatedSlug) return null;

  const translatedSlug = currentPost.data.relatedSlug;

  // Verify translated post exists
  const translatedPost = posts.find(post => {
    const slug = post.id.replace(/^(en|es)\//, '');
    return slug === translatedSlug && post.id.startsWith(`${targetLang}/`);
  });

  if (!translatedPost) return null;

  return targetLang === 'es'
    ? `/blog/${translatedSlug}`
    : `/en/blog/${translatedSlug}`;
}
```

## Debugging Checklist

If your schema fields are missing, check these in order:

- [ ] **File location:** Is it `src/content.config.ts`?
- [ ] **File name:** Is it `content.config.ts` (not `config.ts`)?
- [ ] **No duplicates:** Only ONE content config file exists?
- [ ] **Cache cleared:** Run `rm -rf .astro`?
- [ ] **Import path:** Check `.astro/content.d.ts` references the right file?
- [ ] **Schema syntax:** Valid Zod schema with `z.object()`?
- [ ] **Exported correctly:** Using `export const collections = { ... }`?

## Conclusion

This debugging journey taught me an important lesson: **when troubleshooting framework issues, always verify you're editing the correct configuration files first**.

What seemed like a complex Astro bug was actually a simple configuration mistake. The framework was working perfectly—I was just looking in the wrong place!

Have you encountered similar issues with Astro or other frameworks? The devil is often in the details like file naming and location conventions.

---

**Related Resources:**
- [Astro Content Collections Documentation](https://docs.astro.build/en/guides/content-collections/)
- [Astro Content Layer API](https://docs.astro.build/en/guides/content-layer/)
- [Zod Schema Validation](https://zod.dev/)
