import Head from "next/head";
import Navbar from "@components/navbar/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            {children}
        </>
    );
};

export default Layout;
