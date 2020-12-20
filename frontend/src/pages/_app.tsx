import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "@styles/fonts.css";
import "@styles/global.css";
import theme from "@styles/theme";
import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const client = new ApolloClient({
    uri: "http://localhost:8000/graphql",
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
