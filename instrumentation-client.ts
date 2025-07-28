// This file configures the initialization of Sentry on the client side
import * as Sentry from "@sentry/nextjs";
import { SentryConstants } from "@/src/constants";

Sentry.init({
  dsn: SentryConstants.dsn,
  environment: SentryConstants.environment,
  release: SentryConstants.release,
  
  // Performance Monitoring
  tracesSampleRate: parseFloat(SentryConstants.tracesSampleRate),
  
  integrations: [
    Sentry.replayIntegration({
      // Mask all text and media to protect user privacy
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: parseFloat(SentryConstants.replaysSessionSampleRate),
  replaysOnErrorSampleRate: parseFloat(SentryConstants.replaysOnErrorSampleRate),

  // Disable Sentry during development
  enabled: SentryConstants.environment !== "development",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  beforeSend(event, hint) {
    // Filter out some non-critical errors
    const error = hint.originalException;
    
    // Ignore common network errors
    if (error instanceof Error) {
      if (
        error.message.includes("Network Error") ||
        error.message.includes("fetch") ||
        error.message.includes("AbortError") ||
        error.message.includes("ChunkLoadError")
      ) {
        return null;
      }
    }

    return event;
  },
});

// Required hooks for Next.js 15 Sentry integration
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
