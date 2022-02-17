import { InMemoryCache } from "@apollo/client";

/* https://www.apollographql.com/docs/react/api/cache/InMemoryCache/ */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        hasPermission: {
          /* 
            hasPermission is a field on Query, and only returns a boolean.
            To identify the various permissions in cache, we cache the argument
            e.g. query { hasPermission(permission: "events.add_event") }
            will be cached as hasPermission:events.add_event
          */
          keyArgs: (args) => `${args?.permission}`,
        },
      },
    },
  },
});

export default cache;
