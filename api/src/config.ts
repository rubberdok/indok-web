import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config();

const envVarsSchema = z.object({
  CORS_ORIGINS: z.string().transform((v) => v.split(",")),
  CORS_CREDENTIALS: z.string().transform((v) => v === "true"),
  NODE_ENV: z.string(),
  NO_REPLY_EMAIL: z.string().email(),
  DATABASE_URL: z.string(),
  PORT: z
    .string()
    .transform((val) => Number.parseInt(val))
    .default("4000"),
  SENTRY_DSN: z.string().optional(),
  SENTRY_TRACES_SAMPLE_RATE: z
    .string()
    .transform((val) => Number.parseFloat(val))
    .default("1"),
  FEIDE_CLIENT_ID: z.string(),
  FEIDE_CLIENT_SECRET: z.string(),
  FEIDE_REDIRECT_URI: z.string(),
  FEIDE_BASE_URL: z.string().url(),
  FEIDE_VERIFIER_SECRET: z.string(),
  POSTMARK_API_TOKEN: z.string(),
  SESSION_SECRET: z.string(),
  SESSION_COOKIE_NAME: z.string(),
  SESSION_COOKIE_DOMAIN: z.string(),
  SESSION_COOKIE_HTTP_ONLY: z.string().transform((val) => val === "true"),
  SESSION_COOKIE_SECURE: z.string().transform((val) => val === "true"),
  REDIS_URL: z.string(),
});

export const env = envVarsSchema.parse(process.env);
