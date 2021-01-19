import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import "@styles/fonts.css";
import "@styles/global.css";
import theme from "@styles/theme";
import { AppProps } from "next/app";
import Head from "next/head";
import React, { useEffect } from "react";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const link = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_BACKEND_URI,
    credentials: "include",
  });
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <React.Fragment>
        <Head>
          <title>INDØK</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </React.Fragment>
    </ApolloProvider>
  );
};

export default App;
