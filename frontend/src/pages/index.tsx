import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import styled from "styled-components";

const IndexPage: NextPage = () => (
    <Layout>
        <div>
            <h1>Velkommen til Indøkntnu.no </h1>
            <Link href="/testpage">
                <a>test link</a>
            </Link>
            <br />
            <Link href="/applicationpage">
                <a>Application page</a>
            </Link>
        </div>
    </Layout>
);

export default IndexPage;
