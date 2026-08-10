"use client";
// ^ this file needs the "use client" pragma

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { useRef } from "react";

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

let browserApolloClient: ApolloClient | null = null;

function getApolloClient(cookies: string): ApolloClient {
  if (typeof window === "undefined") {
    return createApolloClient(cookies);
  }

  if (!browserApolloClient) {
    // Browser requests automatically include cookies with `credentials: "include"`.
    browserApolloClient = createApolloClient("");
  }

  return browserApolloClient;
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ cookies, children }: React.PropsWithChildren<{ cookies: string }>) {
  const clientRef = useRef<ApolloClient | null>(null);

  if (!clientRef.current) {
    clientRef.current = getApolloClient(cookies);
  }

  return <ApolloProvider client={clientRef.current}>{children}</ApolloProvider>;
}
