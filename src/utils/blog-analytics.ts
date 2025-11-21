/**
 * Blog Analytics Utilities
 * Centralized tracking for Sentry and Vercel Analytics
 */

import * as Sentry from "@sentry/astro";
import { track } from "@vercel/analytics";

// Types for blog tracking events
export interface BlogArticleContext {
  title: string;
  slug: string;
  tags: string[];
  language: "es" | "en";
  author: string;
  publishedDate: string;
  readingTime: number;
}

export interface ReadingProgressEvent {
  milestone: 25 | 50 | 75 | 100;
  timeSpent: number;
  scrollDepth: number;
}

export interface TOCClickEvent {
  headingText: string;
  headingSlug: string;
  depth: number;
}

export interface ShareEvent {
  platform: "twitter" | "linkedin";
  articleTitle: string;
  articleUrl: string;
}

export interface BlogCardClickEvent {
  articleTitle: string;
  articleSlug: string;
  clickLocation: "index" | "featured" | "related";
  tags: string[];
}

/**
 * Set the current blog article context in Sentry
 * This helps correlate all events with the article being read
 */
export function setBlogArticleContext(context: BlogArticleContext): void {
  Sentry.setContext("blog_article", {
    title: context.title,
    slug: context.slug,
    tags: context.tags,
    language: context.language,
    author: context.author,
    published_date: context.publishedDate,
    reading_time_minutes: context.readingTime,
  });

  // Also set as tags for easier filtering in Sentry
  Sentry.setTags({
    article_slug: context.slug,
    article_language: context.language,
    article_primary_tag: context.tags[0] || "untagged",
  });

  // Add breadcrumb for article view
  Sentry.addBreadcrumb({
    category: "blog",
    message: `Viewing article: ${context.title}`,
    level: "info",
    data: {
      slug: context.slug,
      tags: context.tags.join(", "),
    },
  });
}

/**
 * Track article opened event
 */
export function trackArticleOpened(context: BlogArticleContext): void {
  // Vercel Analytics
  track("blog_article_opened", {
    title: context.title,
    slug: context.slug,
    language: context.language,
    primary_tag: context.tags[0] || "untagged",
    reading_time: context.readingTime,
  });

  // Sentry breadcrumb
  Sentry.addBreadcrumb({
    category: "blog.engagement",
    message: "Article opened",
    level: "info",
    data: {
      title: context.title,
      slug: context.slug,
    },
  });
}

/**
 * Track reading progress milestones
 */
export function trackReadingProgress(
  context: BlogArticleContext,
  event: ReadingProgressEvent
): void {
  // Vercel Analytics
  track("blog_reading_progress", {
    slug: context.slug,
    title: context.title,
    milestone: event.milestone,
    time_spent_seconds: event.timeSpent,
    scroll_depth: event.scrollDepth,
    language: context.language,
  });

  // Sentry breadcrumb
  Sentry.addBreadcrumb({
    category: "blog.engagement",
    message: `Reading progress: ${event.milestone}%`,
    level: "info",
    data: {
      milestone: event.milestone,
      time_spent: event.timeSpent,
      scroll_depth: event.scrollDepth,
    },
  });

  // Special tracking for article completion
  if (event.milestone === 100) {
    Sentry.captureMessage(`Article completed: ${context.title}`, {
      level: "info",
      tags: {
        event_type: "article_completed",
        article_slug: context.slug,
      },
      contexts: {
        engagement: {
          time_spent_seconds: event.timeSpent,
          scroll_depth: event.scrollDepth,
        },
      },
    });
  }
}

/**
 * Track Table of Contents clicks
 */
export function trackTOCClick(
  context: BlogArticleContext,
  event: TOCClickEvent
): void {
  // Vercel Analytics
  track("blog_toc_click", {
    article_slug: context.slug,
    heading_text: event.headingText,
    heading_slug: event.headingSlug,
    heading_depth: event.depth,
  });

  // Sentry breadcrumb
  Sentry.addBreadcrumb({
    category: "blog.navigation",
    message: `TOC clicked: ${event.headingText}`,
    level: "info",
    data: {
      heading_slug: event.headingSlug,
      depth: event.depth,
    },
  });
}

/**
 * Track social share button clicks
 */
export function trackShare(context: BlogArticleContext, event: ShareEvent): void {
  // Vercel Analytics
  track("blog_article_shared", {
    platform: event.platform,
    article_title: event.articleTitle,
    article_slug: context.slug,
    article_url: event.articleUrl,
    language: context.language,
  });

  // Sentry breadcrumb
  Sentry.addBreadcrumb({
    category: "blog.social",
    message: `Article shared on ${event.platform}`,
    level: "info",
    data: {
      platform: event.platform,
      title: event.articleTitle,
    },
  });
}

/**
 * Track blog card clicks
 */
export function trackBlogCardClick(event: BlogCardClickEvent): void {
  // Vercel Analytics
  track("blog_card_clicked", {
    article_title: event.articleTitle,
    article_slug: event.articleSlug,
    click_location: event.clickLocation,
    primary_tag: event.tags[0] || "untagged",
  });

  // Sentry breadcrumb
  Sentry.addBreadcrumb({
    category: "blog.navigation",
    message: `Blog card clicked: ${event.articleTitle}`,
    level: "info",
    data: {
      location: event.clickLocation,
      slug: event.articleSlug,
    },
  });
}

/**
 * Track external link clicks from articles
 */
export function trackExternalLinkClick(
  context: BlogArticleContext,
  url: string,
  linkText: string
): void {
  // Vercel Analytics
  track("blog_external_link_clicked", {
    article_slug: context.slug,
    destination_url: url,
    link_text: linkText,
  });

  // Sentry breadcrumb
  Sentry.addBreadcrumb({
    category: "blog.navigation",
    message: `External link clicked: ${linkText}`,
    level: "info",
    data: {
      url: url,
      link_text: linkText,
    },
  });
}

/**
 * Track when user navigates back to blog index
 */
export function trackBackToBlog(): void {
  track("blog_back_navigation", {
    source: window.location.pathname,
  });

  Sentry.addBreadcrumb({
    category: "blog.navigation",
    message: "Navigated back to blog index",
    level: "info",
  });
}

/**
 * Track time spent on article (called when user leaves)
 */
export function trackTimeSpent(context: BlogArticleContext, seconds: number): void {
  // Only track if user spent at least 5 seconds
  if (seconds < 5) return;

  // Vercel Analytics
  track("blog_time_spent", {
    article_slug: context.slug,
    article_title: context.title,
    time_seconds: seconds,
    time_minutes: Math.round(seconds / 60),
  });

  // Sentry context
  Sentry.setContext("engagement", {
    time_spent_seconds: seconds,
    time_spent_minutes: Math.round(seconds / 60),
    estimated_reading_time: context.readingTime,
    reading_completion_percentage: Math.round(
      (seconds / (context.readingTime * 60)) * 100
    ),
  });
}

/**
 * Debounce utility for scroll events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Throttle utility for frequent events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
