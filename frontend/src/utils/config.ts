const validateEnvironmentVariable = (environmentVariable: string | undefined, name: string): string => {
  if (!environmentVariable) {
    throw new Error(`Couldn't find environment variable: ${name}`);
  }
  return environmentVariable;
};

const buildGraphQLEndpoint = (apiUrl: string): string => `${apiUrl.replace(/\/$/, "")}/graphql/`;

const INTERNAL_API_URL = validateEnvironmentVariable(
  process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_BASE_API_URL,
  "INTERNAL_API_URL or NEXT_PUBLIC_INTERNAL_API_URL"
);

const INTERNAL_GRAPHQL_ENDPOINT = validateEnvironmentVariable(
  process.env.INTERNAL_GRAPHQL_BACKEND_URI ?? buildGraphQLEndpoint(INTERNAL_API_URL),
  "INTERNAL_GRAPHQL_BACKEND_URI or INTERNAL_API_URL"
);

export const config = {
  DATAPORTEN_ID: validateEnvironmentVariable(process.env.NEXT_PUBLIC_DATAPORTEN_ID, "NEXT_PUBLIC_DATAPORTEN_ID"),
  DATAPORTEN_REDIRECT_URI: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_DATAPORTEN_REDIRECT_URI,
    "NEXT_PUBLIC_DATAPORTEN_REDIRECT_URI"
  ),
  GRAPHQL_ENDPOINT: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_GRAPHQL_BACKEND_URI,
    "NEXT_PUBLIC_GRAPHQL_BACKEND_URI"
  ),
  INTERNAL_GRAPHQL_ENDPOINT,
  SENTRY_DSN: validateEnvironmentVariable(process.env.NEXT_PUBLIC_SENTRY_DSN, "NEXT_PUBLIC_SENTRY_DSN"),
  FRONTEND_URI: validateEnvironmentVariable(process.env.NEXT_PUBLIC_FRONTEND_URI, "NEXT_PUBLIC_FRONTEND_URI"),
  APP_ENV: validateEnvironmentVariable(process.env.NEXT_PUBLIC_APP_ENV, "NEXT_PUBLIC_APP_ENV"),
  API_URL: validateEnvironmentVariable(process.env.NEXT_PUBLIC_BASE_API_URL, "NEXT_PUBLIC_BASE_API_URL"),
  INTERNAL_API_URL,
  COOKIE_DOMAIN: validateEnvironmentVariable(process.env.NEXT_PUBLIC_COOKIE_DOMAIN, "NEXT_PUBLIC_COOKIE_DOMAIN"),
  FEIDE_LOGOUT_ENDPOINT: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_FEIDE_LOGOUT_URI,
    "NEXT_PUBLIC_FEIDE_LOGOUT_URI"
  ),
  FEIDE_AUTHORIZATION_URI: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_FEIDE_AUTHORIZATION_URI,
    "NEXT_PUBLIC_FEIDE_AUTHORIZATION_URI"
  ),
};
