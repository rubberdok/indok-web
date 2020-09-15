import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";

const TestPage: NextPage = () => (
    <Layout>
        <div>
            <h1> Test page</h1>
            <Link href="/">back to home</Link>
        </div>
    </Layout>
);

export default TestPage;
