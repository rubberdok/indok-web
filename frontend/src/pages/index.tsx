import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage: NextPage = () => {
    return (
        <Layout>
            <div>
                <h1>Velkommen til Indøkntnu.no </h1>
                <Link href="/testpage">test link</Link>
            </div>

            <Link href="/events"> Go to Events</Link>
        </Layout>
    );
};

export default IndexPage;
