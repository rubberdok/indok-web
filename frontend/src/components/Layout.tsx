import Navbar from "@components/navbar/Navbar";
import Head from "next/head";
import styled from "styled-components";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <Container>
    <Head>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Navbar />
    {children}
    <Footer />
  </Container>
);

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
`;

export default Layout;
