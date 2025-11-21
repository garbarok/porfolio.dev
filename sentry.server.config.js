import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://8d5febdabfbf849e39741670777deaa7@o4510393330434048.ingest.de.sentry.io/4510404401102928",

  sendDefaultPii: true,
  // Enable logs to be sent to Sentry
  enableLogs: true,
  // Define how likely traces are sampled. Adjust this value in production,
  // or use tracesSampler for greater control.
  tracesSampleRate: 1.0,

  // Add environment information
  environment: process.env.NODE_ENV || "production",

  // Before sending events, add additional context
  beforeSend(event) {
    if (process.env.NODE_ENV === "development") {
      return null;
    }
    // Add custom tags for blog-related server requests
    if (event.request?.url?.includes("/blog/")) {
      event.tags = {
        ...event.tags,
        page_type: "blog_article",
        article_path: event.request.url,
      };
    }
    return event;
  },
});
