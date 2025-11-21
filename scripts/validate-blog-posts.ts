#!/usr/bin/env tsx

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BlogPost {
  lang: "es" | "en";
  slug: string;
  filePath: string;
  data: {
    title?: string;
    description?: string;
    pubDate?: string;
    author?: string;
    tags?: string[];
    draft?: boolean;
    relatedSlug?: string;
    image?: {
      url?: string;
      alt?: string;
    };
  };
}

interface ValidationError {
  type: "error" | "warning";
  file: string;
  message: string;
}

function parseFrontmatter(content: string): any {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {};
  }

  const frontmatterText = match[1];
  const data: any = {};

  // Simple YAML parser for our needs
  const lines = frontmatterText.split("\n");
  let currentKey: string | null = null;
  let currentObject: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    // Count leading spaces to detect indentation
    const leadingSpaces = line.length - line.trimStart().length;

    // Handle nested properties (indented with 2+ spaces)
    if (leadingSpaces >= 2 && currentKey && currentObject) {
      const [key, ...valueParts] = trimmed.split(":");
      const value = valueParts.join(":").trim().replace(/^["']|["']$/g, "");
      currentObject[key.trim()] = value;
      continue;
    }

    // Handle arrays
    if (trimmed.startsWith("- ")) {
      if (currentKey) {
        if (!Array.isArray(data[currentKey])) {
          data[currentKey] = [];
        }
        data[currentKey].push(trimmed.substring(2).trim().replace(/^["']|["']$/g, ""));
      }
      continue;
    }

    // Handle key-value pairs at root level
    if (trimmed.includes(":") && leadingSpaces === 0) {
      const colonIndex = trimmed.indexOf(":");
      const key = trimmed.substring(0, colonIndex).trim();
      let value = trimmed.substring(colonIndex + 1).trim();

      // Remove quotes
      value = value.replace(/^["']|["']$/g, "");

      currentKey = key;

      if (value === "") {
        // Empty value means next lines are nested
        data[key] = {};
        currentObject = data[key];
      } else if (value.startsWith("[") && value.endsWith("]")) {
        // Inline array
        data[key] = value
          .slice(1, -1)
          .split(",")
          .map((v) => v.trim().replace(/^["']|["']$/g, ""));
        currentObject = null;
      } else if (value === "true" || value === "false") {
        data[key] = value === "true";
        currentObject = null;
      } else {
        data[key] = value;
        currentObject = null;
      }
    }
  }

  return data;
}

function getBlogPosts(): BlogPost[] {
  const blogDir = path.join(__dirname, "..", "src", "content", "blog");
  const posts: BlogPost[] = [];

  for (const lang of ["es", "en"]) {
    const langDir = path.join(blogDir, lang);
    if (!fs.existsSync(langDir)) continue;

    const files = fs.readdirSync(langDir).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const filePath = path.join(langDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const data = parseFrontmatter(content);
      const slug = file.replace(/\.md$/, "");

      posts.push({
        lang: lang as "es" | "en",
        slug,
        filePath,
        data,
      });
    }
  }

  return posts;
}

function validateBlogPosts(posts: BlogPost[]): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  const requiredFields = ["title", "description", "pubDate", "relatedSlug"];

  for (const post of posts) {
    const relPath = path.relative(process.cwd(), post.filePath);

    // Check required fields
    for (const field of requiredFields) {
      if (!post.data[field as keyof typeof post.data]) {
        errors.push({
          type: "error",
          file: relPath,
          message: `Missing required field: ${field}`,
        });
      }
    }

    // Check draft field
    if (post.data.draft === undefined) {
      errors.push({
        type: "warning",
        file: relPath,
        message: "Missing 'draft' field (defaults to false)",
      });
    }

    // Check tags
    if (!post.data.tags || post.data.tags.length === 0) {
      errors.push({
        type: "warning",
        file: relPath,
        message: "No tags specified",
      });
    }

    // Check author
    if (!post.data.author) {
      errors.push({
        type: "warning",
        file: relPath,
        message: "Missing 'author' field (defaults to Óscar Gallego)",
      });
    }

    // Check image
    if (!post.data.image) {
      errors.push({
        type: "warning",
        file: relPath,
        message: "No image specified",
      });
    } else if (!post.data.image.url) {
      errors.push({
        type: "error",
        file: relPath,
        message: "Image object missing 'url' field",
      });
    } else if (!post.data.image.alt) {
      errors.push({
        type: "warning",
        file: relPath,
        message: "Image missing 'alt' text",
      });
    }
  }

  return errors;
}

function validateRelatedSlugs(posts: BlogPost[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const postsByLang = {
    es: new Map(posts.filter((p) => p.lang === "es").map((p) => [p.slug, p])),
    en: new Map(posts.filter((p) => p.lang === "en").map((p) => [p.slug, p])),
  };

  for (const post of posts) {
    const relPath = path.relative(process.cwd(), post.filePath);

    if (!post.data.relatedSlug) {
      errors.push({
        type: "warning",
        file: relPath,
        message: "No translation link (relatedSlug) specified",
      });
      continue;
    }

    // Check if relatedSlug points to itself
    if (post.data.relatedSlug === post.slug) {
      errors.push({
        type: "error",
        file: relPath,
        message: `relatedSlug points to itself: "${post.data.relatedSlug}"`,
      });
      continue;
    }

    // Check if the related post exists in the other language
    const targetLang = post.lang === "es" ? "en" : "es";
    const relatedPost = postsByLang[targetLang].get(post.data.relatedSlug);

    if (!relatedPost) {
      errors.push({
        type: "error",
        file: relPath,
        message: `relatedSlug "${post.data.relatedSlug}" not found in ${targetLang} posts`,
      });
      continue;
    }

    // Check if the relationship is bidirectional
    if (relatedPost.data.relatedSlug !== post.slug) {
      errors.push({
        type: "error",
        file: relPath,
        message: `relatedSlug mismatch: this post links to "${post.data.relatedSlug}", but that post links to "${relatedPost.data.relatedSlug}" instead of "${post.slug}"`,
      });
    }
  }

  return errors;
}

function printErrors(errors: ValidationError[]) {
  const errorsByFile = new Map<string, ValidationError[]>();

  for (const error of errors) {
    if (!errorsByFile.has(error.file)) {
      errorsByFile.set(error.file, []);
    }
    errorsByFile.get(error.file)!.push(error);
  }

  for (const [file, fileErrors] of errorsByFile.entries()) {
    console.log(`\n📄 ${file}`);
    for (const error of fileErrors) {
      const icon = error.type === "error" ? "❌" : "⚠️";
      console.log(`  ${icon} ${error.message}`);
    }
  }
}

async function main() {
  console.log("🔍 Validating blog posts...\n");

  const posts = getBlogPosts();
  console.log(`Found ${posts.length} blog posts (${posts.filter((p) => p.lang === "es").length} ES, ${posts.filter((p) => p.lang === "en").length} EN)\n`);

  const fieldErrors = validateBlogPosts(posts);
  const linkErrors = validateRelatedSlugs(posts);
  const allErrors = [...fieldErrors, ...linkErrors];

  if (allErrors.length === 0) {
    console.log("✅ All blog posts are valid!\n");
    return;
  }

  const errors = allErrors.filter((e) => e.type === "error");
  const warnings = allErrors.filter((e) => e.type === "warning");

  if (errors.length > 0) {
    console.log(`❌ Found ${errors.length} error(s):`);
    printErrors(errors);
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  Found ${warnings.length} warning(s):`);
    printErrors(warnings);
  }

  console.log();

  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
