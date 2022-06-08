import { ApolloProvider } from "@apollo/client";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { createEmotionCache } from "@lib/emotion";
import { StyledEngineProvider, Theme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/styles";
import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode, useEffect } from "react";
import { useApollo } from "src/lib/apolloClient";
import ThemeWrapper from "src/theme";

// Remove when MUIv4 is gone
declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface CustomAppProps extends AppProps {
  err: Error;
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const App = (props: CustomAppProps): JSX.Element => {
  const { pageProps, err, Component, emotionCache = clientSideEmotionCache } = props;
  const apolloClient = useApollo(pageProps);
  const getLayout = Component.getLayout ?? ((page) => page);

  // Remove when MUIv4 is gone
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <ApolloProvider client={apolloClient}>
        <Head>
          <title>Indøk NTNU - Foreningen for Industriell Økonomi og teknologiledelse</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <StyledEngineProvider injectFirst>
          <ThemeWrapper>{getLayout(<Component {...pageProps} err={err} />)}</ThemeWrapper>
        </StyledEngineProvider>
      </ApolloProvider>
    </CacheProvider>
  );
};

export default App;
