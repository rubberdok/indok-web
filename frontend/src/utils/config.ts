const getEnvironmentVariable = (environmentVariable: string): string => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable];
  if (!unvalidatedEnvironmentVariable) {
    throw new Error(`Couldn't find environment variable: ${environmentVariable}`);
  }
  return unvalidatedEnvironmentVariable;
};

export const config = {
  dataportenId: getEnvironmentVariable("NEXT_PUBLIC_DATAPORTEN_ID"),
  dataportenRedirectUri: getEnvironmentVariable("NEXT_PUBLIC_DATAPORTEN_REDIRECT_URI"),
  dataportenState: getEnvironmentVariable("NEXT_PUBLIC_DATAPORTEN_STATE"),
  graphqlEndpoint: getEnvironmentVariable("NEXT_PUBLIC_GRAPHQL_BACKEND_URI"),
  sentryDsn: getEnvironmentVariable("NEXT_PUBLIC_SENTRY_DSN"),
};
