const validateEnvironmentVariable = (environmentVariable: string | undefined, name: string): string => {
  if (!environmentVariable) {
    throw new Error(`Couldn't find environment variable: ${name}`);
  }
  return environmentVariable;
};

export const config = {
  DATAPORTEN_ID: validateEnvironmentVariable(process.env.NEXT_PUBLIC_DATAPORTEN_ID, "NEXT_PUBLIC_DATAPORTEN_ID"),
  DATAPORTEN_REDIRECT_URI: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_DATAPORTEN_REDIRECT_URI,
    "NEXT_PUBLIC_DATAPORTEN_REDIRECT_URI"
  ),
  DATAPORTEN_STATE: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_DATAPORTEN_STATE,
    "NEXT_PUBLIC_DATAPORTEN_STATE"
  ),
  GRAPHQL_ENDPOINT: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_GRAPHQL_BACKEND_URI,
    "NEXT_PUBLIC_GRAPHQL_BACKEND_URI"
  ),
  INTERNAL_GRAPHQL_ENDPOINT: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_INTERNAL_GRAPHQL_BACKEND_URI,
    "NEXT_PUBLIC_INTERNAL_GRAPHQL_BACKEND_URI"
  ),
  SENTRY_DSN: validateEnvironmentVariable(process.env.NEXT_PUBLIC_SENTRY_DSN, "NEXT_PUBLIC_SENTRY_DSN"),
  FRONTEND_URI: validateEnvironmentVariable(process.env.NEXT_PUBLIC_FRONTEND_URI, "NEXT_PUBLIC_FRONTEND_URI"),
  APP_ENV: validateEnvironmentVariable(process.env.NEXT_PUBLIC_APP_ENV, "NEXT_PUBLIC_APP_ENV"),
};
