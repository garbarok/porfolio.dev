import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://8d5febdabfbf849e39741670777deaa7@o4510393330434048.ingest.de.sentry.io/4510404401102928",

  telemetry: false,

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Sample rate for performance monitoring (1.0 = 100%)
  tracesSampleRate: 1.0,

  // Capture Replay for session replay (10% of sessions)
  replaysSessionSampleRate: 0.1,

  // Capture Replay for sessions with errors (100%)
  replaysOnErrorSampleRate: 1.0,

  // Integrations for better tracking
  integrations: [
    Sentry.browserTracingIntegration({
      // Track navigation and page loads
      tracePropagationTargets: ["localhost", "oscargallegoruiz.com", "porfolio.dev"],
    }),
    Sentry.replayIntegration({
      // Don't record all user interactions to save bandwidth
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Add environment information
  environment: import.meta.env.MODE || "production",

  // Before sending events, add additional context
  beforeSend(event) {
    // Add custom tags for blog articles
    if (window.location.pathname.includes('/blog/')) {
      event.tags = {
        ...event.tags,
        page_type: 'blog_article',
        article_path: window.location.pathname,
      };
    }
    return event;
  },
});
