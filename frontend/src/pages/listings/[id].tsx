import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { gql, useQuery, ApolloClient } from "@apollo/client";

interface Listing {
    id: string;
    title: string;
    description: string;
    startDateTime: string;
    deadline: string;
    endDateTime: string;
    url: string;
}

//TODO: convert to using getStaticPaths/getStaticProps
/* interface Props {
    listingData: Listing;
} */

const Listing: NextPage /* <Props> */ = (/* { listingData }: { listingData: Listing } */) => {
    const router = useRouter();
    console.log(router.query.id);
    const { loading, error, data } = useQuery(LISTING_BY_ID, { variables: { ID: router.query.id as string } });
    if (error) return <h1>Error</h1>;
    if (loading) return <h1>Loading...</h1>;
    const listing = data.listingById;
    console.log(listing);
    return (
        <Layout>
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
        </Layout>
    );
};

export default Listing;

const ALL_LISTING_IDS = gql`
    query allListingIDs {
        allListings {
            id
        }
    }
`;

const LISTING_BY_ID = gql`
    query listingById($ID: String!) {
        listingById(id: $ID) {
            id
            title
            description
            startDateTime
            endDateTime
            url
        }
    }
`;

/* export const getStaticPaths: GetStaticPaths = async () => {
    const { error, data } = useQuery(ALL_LISTING_IDS);
    if (error) {
        console.log("Error fetching listing IDs");
    }
    const paths: string[] = data.allListings.map((listing: Listing) => ({
        params: { id: listing.id },
    }));
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const listingData = useQuery(LISTING_BY_ID, { variables: { id: params?.id as string } });
    return {
        props: {
            listingData,
        },
    };
}; */
