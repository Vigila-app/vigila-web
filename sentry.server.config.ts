// This file configures the initialization of Sentry on the server side
import * as Sentry from "@sentry/nextjs";
import { SentryConstants } from "@/src/constants";

Sentry.init({
  dsn: SentryConstants.dsn,
  environment: SentryConstants.environment,
  release: SentryConstants.release,
  
  // Performance Monitoring
  tracesSampleRate: parseFloat(SentryConstants.tracesSampleRate),
  
  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: parseFloat(SentryConstants.replaysSessionSampleRate),
  replaysOnErrorSampleRate: parseFloat(SentryConstants.replaysOnErrorSampleRate),

  // Disable Sentry during development
  enabled: SentryConstants.environment !== "development",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
