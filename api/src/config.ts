import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config();

const envVarsSchema = z.object({
  NODE_ENV: z.string(),
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
});

export const env = envVarsSchema.parse(process.env);
