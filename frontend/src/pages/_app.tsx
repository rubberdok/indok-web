import { AppProps } from "next/app";
import "../styles/global.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ThemeProvider } from "styled-components";
import theme from "../styles/theme";

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
