import { NextPage } from "next";
import Layout from "@components/Layout";
import AllUsers from "@components/pages/listings/allUsers";
import Link from "next/link";
import NavBar from "@components/navbar/Navbar";

const UsersPage: NextPage = () => (
    <>
        <NavBar />
        <Layout>
            <Link href="/demo">Tilbake</Link>
            <AllUsers />
        </Layout>
    </>
);

export default UsersPage;
