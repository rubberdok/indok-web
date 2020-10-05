import Head from "next/head";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {children}
        </>
    );
};

export default Layout;
