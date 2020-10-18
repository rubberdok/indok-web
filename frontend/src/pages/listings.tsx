import { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/Layout";
import AllListings from "@components/pages/listings/allListings";

const Listings: NextPage = () => {
    return (
        <Layout>
            <Link href="/demo">Tilbake</Link>
            <h3>Åpne verv</h3>
            <AllListings />
        </Layout>
    );
};

export default Listings;
