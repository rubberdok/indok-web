import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import Layout from "@components/Layout";
import AllListings from "@components/pages/listings/allListings";
import NavBar from "@components/navbar/Navbar";

const ListingsPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ userID }) => {
    return (
        <Layout>
            <Link href="/users">Tilbake</Link>
            <h3>Åpne verv</h3>
            <AllListings userID={userID} />
        </Layout>
    );
};

//temporary implementation of user
export const getServerSideProps: GetServerSideProps<{ userID: string }> = async (context) => {
    const userID = context.query.userID as string;
    return {
        props: { userID },
    };
};

export default ListingsPage;
