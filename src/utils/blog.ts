/**
 * Format date to Spanish locale
 * @param date - Date object to format
 * @returns Formatted date string in Spanish
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Calculate reading time based on word count
 * @param content - Content string to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Convert text to URL-friendly slug
 * @param text - Text to slugify
 * @returns URL-safe slug string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Remove HTML tags and markdown formatting from text
 * @param content - HTML or markdown string
 * @returns Plain text without formatting
 */
export function plainify(content: string): string {
  // Remove HTML tags
  const withoutHtml = content.replace(/<[^>]*>/g, "");
  // Remove markdown formatting
  const withoutMarkdown = withoutHtml
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // Bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // Italic
    .replace(/~~(.*?)~~/g, "$1") // Strikethrough
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // Code
    .replace(/#{1,6}\s/g, "") // Headers
    .replace(/>\s/g, "") // Blockquotes
    .replace(/[-*+]\s/g, "") // Lists
    .replace(/\d+\.\s/g, "") // Numbered lists
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1"); // Images

  // Decode HTML entities
  return withoutMarkdown
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Humanize a string by removing special characters and capitalizing
 * @param str - String to humanize
 * @returns Humanized string
 */
export function humanize(str: string): string {
  return str
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/^[a-z]/, (m) => m.toUpperCase());
}

/**
 * Titleify a string by capitalizing each word
 * @param str - String to titleify
 * @returns Titleified string
 */
export function titleify(str: string): string {
  const humanized = humanize(str);
  return humanized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Sort array by date in descending order (newest first)
 * @param array - Array of items with date property
 * @returns Sorted array
 */
export function sortByDate<T extends { data: { pubDate: Date } }>(
  array: T[]
): T[] {
  return array.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}
