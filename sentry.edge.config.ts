// This file configures the initialization of Sentry for edge runtime
import * as Sentry from "@sentry/nextjs";
import { SentryConstants } from "@/src/constants";

Sentry.init({
  dsn: SentryConstants.dsn,
  environment: SentryConstants.environment,
  release: SentryConstants.release,
  
  // Performance Monitoring
  tracesSampleRate: parseFloat(SentryConstants.tracesSampleRate),

  // Disable Sentry during development
  enabled: SentryConstants.environment !== "development",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
