import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { config } from "@utils/config";
import cookie from "cookie";
import merge from "deepmerge";
import Cookies from "js-cookie";
import isEqual from "lodash/isEqual";
import { GetServerSidePropsContext } from "next";
import { AppProps } from "next/app";
import { useMemo } from "react";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";
const CSRF_COOKIE = "csrftoken";

type PageProps = {
  props: AppProps["pageProps"];
  [APOLLO_STATE_PROP_NAME]?: NormalizedCacheObject;
};

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const getCsrfToken = async (req?: GetServerSidePropsContext["req"]) => {
  if (req?.cookies[CSRF_COOKIE]) return req.cookies[CSRF_COOKIE];
  if (Cookies.get(CSRF_COOKIE)) return Cookies.get(CSRF_COOKIE);

  const ssr = typeof window === "undefined";

  const csrfToken: string = await fetch(`${ssr ? config.INTERNAL_API_URL : config.API_URL}/csrf/`)
    .then((response) => response.json())
    .then((data) => data.csrfToken);

  Cookies.set(CSRF_COOKIE, csrfToken, {
    domain: config.COOKIE_DOMAIN,
  });

  return csrfToken;
};

function createApolloClient(ctx?: GetServerSidePropsContext): ApolloClient<NormalizedCacheObject> {
  const uri = typeof window === "undefined" ? config.INTERNAL_GRAPHQL_ENDPOINT : config.GRAPHQL_ENDPOINT;
  const httpLink = new HttpLink({
    uri: uri, // Server URL (must be absolute)
    credentials: "include",
  });

  const authLink = setContext(async (_, { headers }) => {
    // Get the authentication token from cookies
    const csrfToken = await getCsrfToken(ctx?.req);
    if (!csrfToken) throw Error("Missing CSRF token");

    let cookies: string | undefined;
    if (ctx?.req.cookies[CSRF_COOKIE]) {
      cookies = ctx.req.headers.cookie;
    } else if (ctx?.req.headers.cookie) {
      cookies = ctx.req.headers.cookie + `; ${cookie.serialize(CSRF_COOKIE, csrfToken)}`;
    } else {
      cookies = cookie.serialize(CSRF_COOKIE, csrfToken);
    }

    return {
      headers: {
        Cookie: cookies,
        ...headers,
        "X-CSRFToken": Cookies.get(CSRF_COOKIE) ?? csrfToken,
      },
    };
  });

  return new ApolloClient({
    credentials: "include",
    ssrMode: typeof window === "undefined",
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(
  initialState: NormalizedCacheObject = {},
  ctx?: GetServerSidePropsContext
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient(ctx);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s))),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function addApolloState(client: ApolloClient<NormalizedCacheObject>, pageProps: PageProps): PageProps {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps: PageProps): ApolloClient<NormalizedCacheObject> {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}
