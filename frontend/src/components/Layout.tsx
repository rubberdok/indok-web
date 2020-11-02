import Navbar from "@components/navbar/Navbar";
import { useSession } from "next-auth/client";
import Head from "next/head";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [session] = useSession();
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {session && <>signed in as {session.user.name}</>}
            <Navbar />
            {children}
        </>
    );
};

export default Layout;
