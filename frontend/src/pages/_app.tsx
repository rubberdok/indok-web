import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline, responsiveFontSizes } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import "@styles/global.css";
import theme from "@styles/theme";
import { config } from "@utils/config";
import createEmotionCache from "@utils/createEmotionCache";
import { AppProps } from "next/app";
import Head from "next/head";
import React, { useEffect } from "react";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type AppPropsWithCache = AppProps & {
  emotionCache?: EmotionCache;
};

const App = ({ Component, pageProps, emotionCache = clientSideEmotionCache }: AppPropsWithCache): JSX.Element => {
  const link = createHttpLink({
    uri: config.GRAPHQL_ENDPOINT,
    credentials: "include",
  });
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const responsiveTheme = responsiveFontSizes(theme, { breakpoints: ["sm", "md", "lg", "xl"], factor: 2 });

  return (
    <CacheProvider value={emotionCache}>
      <ApolloProvider client={client}>
        <Head>
          <title>Indøk NTNU - Foreningen for Industriell Økonomi og teknologiledelse</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={responsiveTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </CacheProvider>
  );
};

export default App;
