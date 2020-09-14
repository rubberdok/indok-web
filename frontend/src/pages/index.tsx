import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage: NextPage = () => (
    <Layout>
        <div>
            <h1>Velkommen til Indøkntnu.no </h1>
            <Link href="/testpage">test link</Link>
        </div>
    </Layout>
);

export default IndexPage;
