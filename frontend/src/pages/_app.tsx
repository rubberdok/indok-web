import { ApolloProvider } from "@apollo/client";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { NextPageWithLayout } from "@layouts/Layout";
import { useApollo } from "@lib/apolloClient";
import { createEmotionCache } from "@lib/emotion";
import { AppProps } from "next/app";
import Head from "next/head";
import ThemeWrapper from "src/theme";

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

  return (
    <CacheProvider value={emotionCache}>
      <ApolloProvider client={apolloClient}>
        <Head>
          <title>Indøk NTNU - Foreningen for Industriell Økonomi og teknologiledelse</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <ThemeWrapper>{getLayout(<Component {...pageProps} err={err} />)}</ThemeWrapper>
      </ApolloProvider>
    </CacheProvider>
  );
};

export default App;
