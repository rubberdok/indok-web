const validateEnvironmentVariable = (environmentVariable: string | undefined): string => {
  if (!environmentVariable) {
    throw new Error(`Couldn't find environment variable: ${environmentVariable}`);
  }
  return environmentVariable;
};

export const config = {
  dataportenId: validateEnvironmentVariable(process.env.NEXT_PUBLIC_DATAPORTEN_ID),
  dataportenRedirectUri: validateEnvironmentVariable(process.env.NEXT_PUBLIC_REDIRECT_URI),
  dataportenState: validateEnvironmentVariable(process.env.NEXT_PUBLIC_DATAPORTEN_STATE),
  graphqlEndpoint: validateEnvironmentVariable(process.env.NEXT_PUBLIC_GRAPHQL_BACKEND_URI),
  sentryDsn: validateEnvironmentVariable(process.env.NEXT_PUBLIC_SENTRY_DSN),
  frontendUri: validateEnvironmentVariable(process.env.NEXT_PUBLIC_FRONTEND_URI),
};
