import { ApolloProvider } from "@apollo/client";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";

import { PageProps, useApollo } from "@/lib/apolloClient";
import { initializeDayjs } from "@/lib/dayjs";
import { createEmotionCache } from "@/lib/emotion";
import { ThemeProvider } from "@/lib/theme";

initializeDayjs();

export type NextPageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type CustomAppProps = AppProps<PageProps> & {
  err: Error;
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
};

const clientSideEmotionCache = createEmotionCache();

const App = (props: CustomAppProps): JSX.Element => {
  const { pageProps, err, Component, emotionCache = clientSideEmotionCache } = props;
  const apolloClient = useApollo(pageProps);
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <ApolloProvider client={apolloClient}>
        <Head>
          <title>Indøk NTNU - Foreningen for Industriell Økonomi og teknologiledelse</title>
          <meta
            name="description"
            content={`Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen
             for all studentfrivillighet på masterstudiet Indøk ved NTNU. Arrangementer, verv, 
             og oversikt over det sosiale på Indøk.`}
          />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider>{getLayout(<Component {...pageProps} err={err} />)}</ThemeProvider>
      </ApolloProvider>
    </CacheProvider>
  );
};

export default App;
