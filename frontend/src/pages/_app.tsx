import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import "@styles/fonts.css";
import "@styles/global.css";
import theme from "@styles/theme";
import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const link = createHttpLink({
    uri: "http://localhost:8000/graphql",
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
