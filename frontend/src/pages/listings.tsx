import { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/Layout";
import AllListings from "@components/pages/listings/allListings";
import CreateListing from "@components/pages/listings/createListing";

const Listings: NextPage = () => {
    return (
        <Layout>
            <Link href="/">Back to home</Link>
            <CreateListing />
            <AllListings />
        </Layout>
    );
};

export default Listings;
