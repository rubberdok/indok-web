import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";
import Layout from "../../components/Layout";
import { gql, useQuery } from "@apollo/client";

const Listing: NextPage = () => {
    return (
        <Layout>
            <p>Test</p>
        </Layout>
    );
};

export default Listing;

const ALL_LISTING_IDS = gql`
    query allListingIDs {
        listings {
            id
        }
    }
`;

const LISTING_BY_ID = gql`
    query listingByID(ID: Int!) {

    }
`;

interface Listing {
    id: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { error, data } = useQuery(ALL_LISTING_IDS);
    if (error) {
        console.log("Error fetching listing IDs");
    }
    const paths: string[] = data.listings.map(({ listing }: { listing: Listing }) => ({ params: { id: listing.id } }));
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const listingData = useQuery(LISTING_BY_ID, { variables: { params } });
    return {
        props: {
            listingData,
        },
    };
};
