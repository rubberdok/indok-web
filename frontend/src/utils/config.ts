const validateEnvironmentVariable = (environmentVariable: string | undefined, name: string): string => {
  if (!environmentVariable) {
    throw new Error(`Couldn't find environment variable: ${name}`);
  }
  return environmentVariable;
};

export const config = {
  dataportenId: validateEnvironmentVariable(process.env.NEXT_PUBLIC_DATAPORTEN_ID, "NEXT_PUBLIC_DATAPORTEN_ID"),
  dataportenRedirectUri: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_DATAPORTEN_REDIRECT_URI,
    "NEXT_PUBLIC_DATAPORTEN_REDIRECT_URI"
  ),
  dataportenState: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_DATAPORTEN_STATE,
    "NEXT_PUBLIC_DATAPORTEN_STATE"
  ),
  graphqlEndpoint: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_GRAPHQL_BACKEND_URI,
    "NEXT_PUBLIC_GRAPHQL_BACKEND_URI"
  ),
  sentryDsn: validateEnvironmentVariable(process.env.NEXT_PUBLIC_SENTRY_DSN, "NEXT_PUBLIC_SENTRY_DSN"),
  frontendUri: validateEnvironmentVariable(process.env.NEXT_PUBLIC_FRONTEND_URI, "NEXT_PUBLIC_FRONTEND_URI"),
};
