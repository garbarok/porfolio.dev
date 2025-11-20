import type { CollectionEntry } from "astro:content";

const WORDS_PER_MINUTE = 200;
const SPANISH_LOCALE = "es-ES";

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(SPANISH_LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function calculateReadingTime(content: string): number {
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / WORDS_PER_MINUTE);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function plainify(content: string): string {
  const withoutHtml = content.replace(/<[^>]*>/g, "");
  const withoutMarkdown = withoutHtml
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/>\s/g, "")
    .replace(/[-*+]\s/g, "")
    .replace(/\d+\.\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");

  return withoutMarkdown
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function humanize(str: string): string {
  return str
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/^[a-z]/, (m) => m.toUpperCase());
}

export function titleify(str: string): string {
  const humanized = humanize(str);
  return humanized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function sortByDate<T extends { data: { pubDate: Date } }>(
  array: T[]
): T[] {
  return array.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

export function getPublishedPosts(posts: CollectionEntry<"blog">[]) {
  return posts.filter((post) => !post.data.draft);
}

export function getAllTags(posts: CollectionEntry<"blog">[]): string[] {
  const tags = posts.flatMap((post) => post.data.tags);
  return [...new Set(tags)].sort();
}
