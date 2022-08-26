import { ApolloProvider } from "@apollo/client";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { useApollo } from "@lib/apolloClient";
import { createEmotionCache } from "@lib/emotion";
import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import ThemeWrapper from "src/theme";
import { useTernaryDarkMode } from "usehooks-ts";

export type NextPageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type CustomAppProps = AppProps & {
  err: Error;
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
};

const clientSideEmotionCache = createEmotionCache();

const App = (props: CustomAppProps): JSX.Element => {
  const { pageProps, err, Component, emotionCache = clientSideEmotionCache } = props;
  const apolloClient = useApollo(pageProps);
  const getLayout = Component.getLayout ?? ((page) => page);
  const { isDarkMode } = useTernaryDarkMode();

  return (
    <CacheProvider value={emotionCache}>
      <ApolloProvider client={apolloClient}>
        <Head>
          <title>Indøk NTNU - Foreningen for Industriell Økonomi og teknologiledelse</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <meta name="theme-color" content={isDarkMode ? "#0f1217" : "#fff"} />
          <meta name="format-detection" content="telephone=no" />
        </Head>
        <ThemeWrapper>{getLayout(<Component {...pageProps} err={err} />)}</ThemeWrapper>
      </ApolloProvider>
    </CacheProvider>
  );
};

export default App;
