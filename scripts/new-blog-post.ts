#!/usr/bin/env tsx

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BlogPostData {
  title: string;
  description: string;
  lang: "es" | "en";
  slug: string;
  tags: string[];
  imageUrl?: string;
  imageAlt?: string;
  relatedSlug?: string;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/--+/g, "-") // Replace multiple - with single -
    .trim();
}

function generateBlogPostContent(data: BlogPostData): string {
  const date = new Date().toISOString().split("T")[0];

  let frontmatter = `---
title: "${data.title}"
description: "${data.description}"
pubDate: ${date}
author: "Óscar Gallego"
tags: [${data.tags.map((t) => `"${t}"`).join(", ")}]
draft: false
relatedSlug: "${data.relatedSlug || ""}"`;

  if (data.imageUrl) {
    frontmatter += `
image:
  url: "${data.imageUrl}"
  alt: "${data.imageAlt || data.title}"`;
  }

  frontmatter += `
---

## ${data.title}

<!-- Write your content here -->
`;

  return frontmatter;
}

async function addToCloudinaryMapping(
  slug: string,
  cloudinaryId: string
): Promise<boolean> {
  const files = [
    path.join(__dirname, "..", "src", "utils", "cloudinary.ts"),
    path.join(__dirname, "check-cloudinary-images.ts"),
  ];

  for (const filePath of files) {
    try {
      let content = fs.readFileSync(filePath, "utf-8");

      // Find the BLOG_IMAGES object (with or without 'export')
      const regex = /((?:export )?const BLOG_IMAGES = \{)([\s\S]*?)(\} as const;?)/;
      const match = content.match(regex);

      if (!match) {
        console.warn(
          `⚠️  Could not find BLOG_IMAGES in ${path.basename(filePath)}`
        );
        continue;
      }

      const [, opening, entries, closing] = match;

      // Parse existing entries
      const lines = entries
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("//"));

      // Check if slug already exists
      const existingEntry = lines.find((line) =>
        line.includes(`'${slug}':`)
      );
      if (existingEntry) {
        console.log(
          `   ℹ️  Slug '${slug}' already exists in ${path.basename(filePath)}`
        );
        continue;
      }

      // Add new entry
      const newEntry = `  '${slug}': '${cloudinaryId}',`;
      lines.push(newEntry);

      // Sort entries alphabetically by key
      lines.sort((a, b) => {
        const keyA = a.match(/'([^']+)':/)?.[1] || "";
        const keyB = b.match(/'([^']+)':/)?.[1] || "";
        return keyA.localeCompare(keyB);
      });

      // Rebuild the object
      const newEntries = "\n" + lines.join("\n") + "\n";
      const newBlogImages = opening + newEntries + closing;

      // Replace in content
      content = content.replace(regex, newBlogImages);

      // Write back
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`   ✅ Added to ${path.basename(filePath)}`);
    } catch (error) {
      console.error(
        `   ❌ Error updating ${path.basename(filePath)}:`,
        error
      );
      return false;
    }
  }

  return true;
}

async function createBlogPost(
  data: BlogPostData,
  cloudinaryId?: string
): Promise<boolean> {
  const blogDir = path.join(
    __dirname,
    "..",
    "src",
    "content",
    "blog",
    data.lang
  );
  const filePath = path.join(blogDir, `${data.slug}.md`);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.error(`❌ Error: File already exists at ${filePath}`);
    return false;
  }

  // Ensure directory exists
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  // Create the file
  const content = generateBlogPostContent(data);
  fs.writeFileSync(filePath, content, "utf-8");

  console.log(`✅ Created blog post: ${filePath}`);

  // Add to Cloudinary mapping if image was provided
  if (cloudinaryId) {
    console.log("\n📸 Adding image to Cloudinary mappings...");
    await addToCloudinaryMapping(data.slug, cloudinaryId);
  }

  return true;
}

async function main() {
  console.log("📝 New Blog Post Generator\n");

  const lang = (await question("Language (es/en): ")) as "es" | "en";
  if (!["es", "en"].includes(lang)) {
    console.error("❌ Invalid language. Must be 'es' or 'en'");
    rl.close();
    return;
  }

  const title = await question("Title: ");
  if (!title) {
    console.error("❌ Title is required");
    rl.close();
    return;
  }

  const description = await question("Description: ");
  if (!description) {
    console.error("❌ Description is required");
    rl.close();
    return;
  }

  const suggestedSlug = slugify(title);
  const slugInput = await question(`Slug (${suggestedSlug}): `);
  const slug = slugInput || suggestedSlug;

  const tagsInput = await question("Tags (comma-separated): ");
  const tags = tagsInput
    ? tagsInput.split(",").map((t) => t.trim())
    : [];

  // Cloudinary image setup
  console.log("\n📸 Image Configuration");
  console.log(
    "   Tip: Use Cloudinary public IDs (e.g., blog/my-post.png)"
  );
  const cloudinaryId = await question("Cloudinary public ID (optional): ");

  let imageUrl = "";
  let imageAlt = "";

  if (cloudinaryId) {
    // Generate Cloudinary URL
    const cloudinaryBase =
      "https://res.cloudinary.com/dl0qx4iof/image/upload";
    imageUrl = `${cloudinaryBase}/${cloudinaryId}`;
    imageAlt = await question("Image alt text: ");
  }

  const relatedSlug = await question(
    "\nRelated slug in other language (optional): "
  );

  const data: BlogPostData = {
    title,
    description,
    lang,
    slug,
    tags,
    imageUrl: imageUrl || undefined,
    imageAlt: imageAlt || undefined,
    relatedSlug: relatedSlug || undefined,
  };

  console.log("\n📋 Summary:");
  console.log(`Language: ${lang}`);
  console.log(`Title: ${title}`);
  console.log(`Slug: ${slug}`);
  console.log(`Tags: ${tags.join(", ")}`);
  console.log(`Related slug: ${relatedSlug || "none"}\n`);

  const confirm = await question("Create this blog post? (y/n): ");
  if (confirm.toLowerCase() === "y") {
    await createBlogPost(data, cloudinaryId || undefined);

    if (relatedSlug) {
      console.log(
        `\n⚠️  Remember to update the relatedSlug in the translation:`
      );
      console.log(
        `   src/content/blog/${lang === "es" ? "en" : "es"}/${relatedSlug}.md`
      );
      console.log(`   relatedSlug: "${slug}"`);
    } else {
      console.log(
        `\n⚠️  Remember to create the translation and link them with relatedSlug!`
      );
    }

    console.log(`\n✨ Run 'npm run blog:validate' to verify links\n`);
  } else {
    console.log("❌ Cancelled");
  }

  rl.close();
}

main().catch((error) => {
  console.error("Error:", error);
  rl.close();
  process.exit(1);
});
