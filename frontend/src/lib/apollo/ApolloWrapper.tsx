"use client";
// ^ this file needs the "use client" pragma

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { useMemo } from "react";

import { config } from "@/utils/config";

function createApolloClient(cookies: string): ApolloClient {
  const uri = typeof window === "undefined" ? config.INTERNAL_GRAPHQL_ENDPOINT : config.GRAPHQL_ENDPOINT;

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri,
      fetchOptions: { cache: "no-store" },
      credentials: "include",
      headers: cookies ? { Cookie: cookies } : undefined,
    }),
  });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ cookies, children }: React.PropsWithChildren<{ cookies: string }>) {
  const client = useMemo(() => createApolloClient(cookies), [cookies]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
