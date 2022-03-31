import { ApolloProvider } from "@apollo/client";
import { CssBaseline, responsiveFontSizes } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import "@styles/global.css";
import theme from "@styles/theme";
import { AppProps } from "next/app";
import Head from "next/head";
import React, { useEffect } from "react";
import { useApollo } from "src/lib/apolloClient";

type AppPropsWithError = AppProps & { err: Error };

const App = ({ Component, pageProps, err }: AppPropsWithError): JSX.Element => {
  const apolloClient = useApollo(pageProps);

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const responsiveTheme = responsiveFontSizes(theme, { breakpoints: ["sm", "md", "lg", "xl"], factor: 2 });

  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <title>Indøk NTNU - Foreningen for Industriell Økonomi og teknologiledelse</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={responsiveTheme}>
        <CssBaseline />
        <Component {...pageProps} err={err} />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
