import { NextPage } from "next";
import Layout from "@components/Layout";
import AllUsers from "@components/pages/listings/allUsers";

const UserPage: NextPage = () => (
    <Layout>
        <AllUsers />
    </Layout>
);

export default UserPage;