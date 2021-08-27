import { ApolloProvider } from "@apollo/client";
import { CssBaseline, responsiveFontSizes } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import "@styles/global.css";
import theme from "@styles/theme";
import { AppProps } from "next/app";
import Head from "next/head";
import React, { useEffect } from "react";
import client from "./apollo-client";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const responsiveTheme = responsiveFontSizes(theme, { breakpoints: ["sm", "md", "lg", "xl"], factor: 2 });

  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Indøk NTNU - Foreningen for Industriell Økonomi og teknologiledelse</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={responsiveTheme}>
        <CssBaseline />
        <Component {...pageProps} />
        {/* <div id="mobile-warning">
          Denne siden fungerer ikke optimalt på mobil enda. Prøv nettsiden på en større skjerm.
        </div> */}
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
