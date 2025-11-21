import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://8d5febdabfbf849e39741670777deaa7@o4510393330434048.ingest.de.sentry.io/4510404401102928",

  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Enable logs to be sent to Sentry
  enableLogs: true,
  // Define how likely traces are sampled. Adjust this value in production,
  // or use tracesSampler for greater control.
  tracesSampleRate: 1.0,
  // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysSessionSampleRate: 0.1,
  // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  replaysOnErrorSampleRate: 1.0,

  // Add environment information
  environment: import.meta.env.MODE || "production",

  // Before sending events, add additional context
  beforeSend(event) {
    if (import.meta.env.MODE === "development") {
      return null;
    }
    // Add custom tags for blog articles
    if (window.location.pathname.includes("/blog/")) {
      event.tags = {
        ...event.tags,
        page_type: "blog_article",
        article_path: window.location.pathname,
      };
    }
    return event;
  },
});
