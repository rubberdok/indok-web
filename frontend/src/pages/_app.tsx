import { AppProps } from "next/app";
import "@styles/global.css";
import "@styles/fonts.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ThemeProvider } from "styled-components";
import theme from "@styles/theme";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  console.log("URL:", process.env.GRAPHQL_BACKEND_URI);
  const client = new ApolloClient({
    uri: process.env.GRAPHQL_BACKEND_URI,
    cache: new InMemoryCache(),
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
