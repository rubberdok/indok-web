import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { cookies } from "next/headers";

import { config } from "@/utils/config";
import { setContext } from "@apollo/client/link/context";

/**
 * Get an Apollo Client to be used for RSC
 */
export const { getClient } = registerApolloClient(() => {
  const cookieStore = cookies();
  const transactionIdLink = setContext(() => {
    return {
      headers: {
        "x-transaction-id": Math.random().toString(16).slice(2),
      },
    };
  });
  const httpLink = new HttpLink({
    uri: config.GRAPHQL_ENDPOINT,
    fetchOptions: { cache: "no-store" },
    credentials: "include",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const link = ApolloLink.from([transactionIdLink, httpLink]);
  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });
});
