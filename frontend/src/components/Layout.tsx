import Navbar from "@components/navbar/Navbar";
import Head from "next/head";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Head>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Navbar />
    {children}
    <Footer />
  </>
);

export default Layout;
