---
title: "Astro Content Collections: Why Your Schema Fields Are Missing"
description: "A debugging journey: How an incorrect content config file location can make your Astro schema fields disappear, and how to fix it."
pubDate: 2025-11-18
author: "Óscar Gallego"
tags: ["astro", "debugging", "content collections", "typescript"]
draft: false
relatedSlug: "astro-ubicacion-content-config"
image:
  url: "https://res.cloudinary.com/dl0qx4iof/image/upload/blog/astro-debugging.png"
  alt: "A developer debugging Astro configuration files on a computer screen."
---

Have you ever defined a field in your Astro content collection schema, only for it to vanish at runtime? You're not alone. I recently spent hours debugging an issue where my schema fields were inexplicably missing, despite being correctly defined.

> **TL;DR: The Problem & Solution**
> **Problem:** My new schema fields were missing because I was editing `src/content/config.ts`.
> **Solution:** Astro only recognizes `src/content.config.ts`. I had to move my changes to the correctly named and located file and delete the duplicate.

This article walks through the debugging process, the root cause, and how you can avoid this common pitfall.

## The Mystery of the Disappearing Schema Fields

While adding a `relatedSlug` field to my blog's schema for multilingual support, I hit a wall. The field was defined in the schema and present in the Markdown frontmatter, but it was completely absent from the `post.data` object.

### The Symptoms

My setup seemed correct, but the `relatedSlug` field was nowhere to be found in the TypeScript types or at runtime.

```typescript
// src/content/config.ts
import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    // ... other fields
    relatedSlug: z.string().optional(), // ❌ This field was missing!
  }),
});

export const collections = { blog: blogCollection };
```

- ✅ **Defined in Schema:** The `relatedSlug` field was clearly part of the Zod schema.
- ✅ **Present in Frontmatter:** My `.md` files included `relatedSlug: "some-slug"`.
- ❌ **Missing at Runtime:** `'relatedSlug' in post.data` returned `false`.

### The Investigation: What Didn't Work

I suspected a bug in Astro or Zod, so I tried several workarounds, none of which resolved the issue:

1.  **Using `.default()`:** I replaced `.optional()` with `.default("")`, hoping to force the field's existence. The field was still missing.
2.  **Making it Required:** I removed `.optional()`, making the field mandatory. Astro should have thrown an error for missing fields, but it didn't. The field remained absent.
3.  **Changing the Field Name:** I renamed `relatedSlug` to `translation` to rule out a naming conflict. The new field was also missing.

The fact that even **required fields** were being ignored was a major clue that something was fundamentally wrong with how Astro was reading my configuration.

## The Root Cause: A Simple File Misplacement

After hours of debugging, the answer was embarrassingly simple: **I was editing the wrong file.**

According to the Astro documentation, the content collections configuration file has strict naming and location requirements.

- **Correct File:** `src/content.config.ts`
- **My File:** `src/content/config.ts`

> I had accidentally created a configuration file inside the `content` directory. Astro was completely ignoring this file and reading an older version of `content.config.ts` located in the `src` root.

This subtle difference was the source of all my problems.

## The Solution: A 4-Step Fix

Fixing the issue was straightforward once the root cause was identified.

### Step 1: Locate the Correct Config File

First, I had to confirm which file Astro was actually using. The generated types in `.astro/` provide the answer.

```typescript
// .astro/content.d.ts
// This line reveals the source of truth:
export type ContentConfig = typeof import("../src/content.config.js");
```

### Step 2: Consolidate and Delete

I copied my latest schema definitions from the incorrect file (`src/content/config.ts`) into the correct one (`src/content.config.ts`) and then deleted the duplicate.

```bash
# Delete the incorrect configuration file
rm src/content/config.ts
```

### Step 3: Update the Correct File

With the duplicate gone, I ensured the correct file (`src/content.config.ts`) had the final schema.

```typescript
// src/content.config.ts ✅
import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    // ... all my fields
    relatedSlug: z.string(), // ✅ Now it works!
  }),
});

export const collections = { blog: blogCollection };
```

### Step 4: Clear the Cache

Finally, to ensure Astro picked up the changes, I cleared the cache and restarted the dev server.

```bash
# Clear the .astro cache directory
rm -rf .astro
# Restart the development server
npm run dev
```

After these steps, the `relatedSlug` field appeared correctly in my types and at runtime.

## Debugging Checklist for Astro Content Collections

If you face a similar issue, run through this checklist before diving deep into debugging:

- [ ] **Correct File Location:** Is your config file at `src/content.config.ts`?
- [ ] **Correct File Name:** Is it named `content.config.ts` exactly?
- [ ] **No Duplicates:** Is there only one `content.config.ts` file in your project?
- [ ] **Cache Cleared:** Have you tried deleting the `.astro` directory?
- [ ] **Schema Export:** Does your config file properly `export const collections`?

## Conclusion

This experience was a classic reminder: **master the conventions of your framework.** What felt like a complex bug was a simple misconfiguration. Before you suspect a bug in the tool, always double-check that you're following its core conventions.