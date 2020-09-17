import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import styled from "styled-components";

const StyledHeader = styled.h1`
    color: ${({ theme }) => theme.colors.primary};
`;

const IndexPage: NextPage = () => (
    <Layout>
        <div>
            <StyledHeader>Velkommen til Indøkntnu.no </StyledHeader>
            <Link href="/testpage">test link</Link>
        </div>
    </Layout>
);

export default IndexPage;
