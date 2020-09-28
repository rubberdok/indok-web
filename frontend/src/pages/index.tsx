import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { StyledHeader1 } from "..components/ui/Typography"
import styled from "styled-components";

const StyledHeader = styled.h1`
    color: ${({ theme }) => theme.colors.primary};
`;

const IndexPage: NextPage = () => (
    <Layout>
        <div>
            <StyledHeader1>Velkommen til Indøkntnu.no </StyledHeader1>
            <Link href="/testpage">test link</Link>
        </div>
    </Layout>
);

export default IndexPage;
