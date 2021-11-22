import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline, responsiveFontSizes } from "@mui/material";
import { StyledEngineProvider, Theme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/styles";
import "@styles/global.css";
import theme from "@styles/theme";
import { config } from "@utils/config";
import createEmotionCache from "@utils/createEmotionCache";
import { AppProps } from "next/app";
import Head from "next/head";

declare module "@mui/styles" {
  interface DefaultTheme extends Theme {}
}

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

  const responsiveTheme = responsiveFontSizes(theme);

  return (
    <ApolloProvider client={client}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Indøk NTNU - Foreningen for Industriell Økonomi og teknologiledelse</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={responsiveTheme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </StyledEngineProvider>
      </CacheProvider>
    </ApolloProvider>
  );
};

export default App;
