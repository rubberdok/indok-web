// import Navbar from "@components/navbar/Navbar";
import Head from "next/head";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Head>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {/* <Navbar /> */}
    {children}
  </>
);

export default Layout;
