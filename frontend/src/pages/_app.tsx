import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import "@styles/fonts.css";
import "@styles/global.css";
import theme from "@styles/theme";
import { AppProps } from "next/app";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { ThemeProvider } from "styled-components";
import "../styles/global.css";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const link = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_BACKEND_URI,
    credentials: "include",
  });
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
