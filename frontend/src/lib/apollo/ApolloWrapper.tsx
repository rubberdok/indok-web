"use client";
// ^ this file needs the "use client" pragma

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";

import { config } from "@/utils/config";

function getMakeClientHandler(cookies: string) {
  // have a function to create a client for you
  return function makeClient() {
    const httpLink = new HttpLink({
      // this needs to be an absolute url, as relative urls cannot be used in SSR
      uri: config.GRAPHQL_ENDPOINT,
      // you can disable result caching here if you want to
      // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
      fetchOptions: { cache: "no-store" },
      credentials: "include",
      headers: {
        cookies: cookies,
      },
    });

    return new NextSSRApolloClient({
      // use the `NextSSRInMemoryCache`, not the normal `InMemoryCache`
      cache: new NextSSRInMemoryCache(),
      connectToDevTools: true,
      headers: {
        cookies: cookies,
      },
      link:
        typeof window === "undefined"
          ? ApolloLink.from([
              // in a SSR environment, if you use multipart features like
              // @defer, you need to decide how to handle these.
              // This strips all interfaces with a `@defer` directive from your queries.
              new SSRMultipartLink({
                stripDefer: true,
              }),
              httpLink,
            ])
          : httpLink,
    });
  };
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ cookies, children }: React.PropsWithChildren<{ cookies: string }>) {
  const makeClient = getMakeClientHandler(cookies);

  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
