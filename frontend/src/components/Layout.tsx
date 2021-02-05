import ScrollTop from "@components/ui/ScrollTop";
import Head from "next/head";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Head>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {/* <Navbar /> */}
    {children}
    <ScrollTop />
    <Footer />
  </>
);

export default Layout;
