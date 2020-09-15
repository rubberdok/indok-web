import { AppProps } from "next/app";
import "../styles/global.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    const client = new ApolloClient({
        uri: "http://localhost:8000/graphql",
    });
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    );
};

export default App;
