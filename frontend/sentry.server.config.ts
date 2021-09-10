// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const ENVIRONMENT = process.env.NODE_ENV;
const SENTRY_RELEASE = process.env.SENTRY_RELEASE;

if (ENVIRONMENT === "production" && SENTRY_RELEASE) {
  const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

  Sentry.init({
    dsn: SENTRY_DSN || "https://4a40409b5c6f4a759eff513c338a18be@o514678.ingest.sentry.io/5618306",
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    release: SENTRY_RELEASE,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
    environment: ENVIRONMENT,
  });
}
