import { NextPage } from "next";
import Link from "next/link";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import EventInfo from "./events";
import Layout from "../components/Layout";

const IndexPage: NextPage = () => {
    const client = new ApolloClient({
        uri: "http://localhost:8000/graphql",
    });

    return (
        <Layout>
            <ApolloProvider client={client}>
                <div>
                    <h1>Velkommen til Indøkntnu.no </h1>
                    <Link href="/testpage">test link</Link>
                </div>

                <EventInfo />
            </ApolloProvider>
        </Layout>
    );
};

export default IndexPage;
