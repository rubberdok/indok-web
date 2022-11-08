import "reflect-metadata";

import * as Sentry from "@sentry/node";

import { env } from "@/config";

import { initializeServer } from "./server";

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
});

initializeServer();
