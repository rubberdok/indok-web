import { ApolloProvider } from "@apollo/client";
import { CacheProvider, EmotionCache } from "@emotion/react";

import { PageProps, useApollo } from "@/lib/apolloClient";
import { createEmotionCache } from "@/lib/emotion";

import { ThemeProvider } from "./ThemeProvider";

const clientSideEmotionCache = createEmotionCache();

type Props = {
  pageProps: PageProps;
  emotionCache?: EmotionCache;
};
export const AppProvider: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { pageProps, emotionCache = clientSideEmotionCache, children } = props;
  const apolloClient = useApollo(pageProps);

  return (
    <CacheProvider value={emotionCache}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider>{children}</ThemeProvider>
      </ApolloProvider>
    </CacheProvider>
  );
};
