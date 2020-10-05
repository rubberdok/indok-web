import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { StyledHeader } from "../components/styled/Lib";

const IndexPage: NextPage = () => (
    <Layout>
        <div>
            <StyledHeader>Velkommen til Indøkntnu.no </StyledHeader>
            <Link href="/testpage">test link</Link>
        </div>
        <Link href="/events"> Go to Events</Link>
    </Layout>
);

export default IndexPage;
