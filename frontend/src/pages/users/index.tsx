import { NextPage } from "next";
import Layout from "@components/Layout";
import AllUsers from "@components/pages/listings/allUsers";
import CreateUser from "@components/pages/listings/createUser";
import Link from "next/link";
import NavBar from "@components/navbar/Navbar";

const UsersPage: NextPage = () => (
  <Layout>
    <Link href="/demo">Tilbake</Link>
    <AllUsers />
    <CreateUser />
  </Layout>
);

export default UsersPage;
