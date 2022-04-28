import { ApolloProvider } from "@apollo/client";
import { StyledEngineProvider, Theme } from "@mui/material/styles";
import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import React, { ReactElement, ReactNode, useEffect } from "react";
import { useApollo } from "src/lib/apolloClient";
import ThemeWrapper from "src/theme";

// Remove when MUIv4 is gone
declare module "@mui/styles/defaultTheme" {
  type DefaultTheme = Theme;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  err: Error;
  Component: NextPageWithLayout;
}

const App = ({ Component, pageProps, err }: MyAppProps): JSX.Element => {
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
    <ApolloProvider client={apolloClient}>
      <Head>
        <title>Indøk NTNU - Foreningen for Industriell Økonomi og teknologiledelse</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeWrapper>{getLayout(<Component {...pageProps} err={err} />)}</ThemeWrapper>
      </StyledEngineProvider>
    </ApolloProvider>
  );
};

export default App;
