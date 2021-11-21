import { InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        hasPermission: {
          keyArgs: (args) => `${args?.permission}`,
        },
      },
    },
  },
});

export default cache;
