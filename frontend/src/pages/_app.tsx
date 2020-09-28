import { AppProps } from "next/app";
import "../styles/global.css";
import "react-calendar/dist/Calendar.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    const client = new ApolloClient({
        uri: "http://localhost:8000/graphql",
        cache: new InMemoryCache(),
    });
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    );
};

export default App;
