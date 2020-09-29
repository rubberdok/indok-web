import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { gql, useQuery, ApolloClient } from "@apollo/client";
import TextField from "../../components/listing_response_components/textfield";

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
    const { loading, error, data } = useQuery(LISTING_BY_ID, { variables: { ID: Number(router.query.id) } });
    if (error) return <h1>Error</h1>;
    if (loading) return <h1>Loading...</h1>;
    const listing = data.listingById;
    return (
        <Layout>
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <TextField title="Apply:" placeholder="Your application" size="short" />
        </Layout>
    );
};

export default Listing;

const LISTING_BY_ID = gql`
    query listingById($ID: Int!) {
        listingById(id: $ID) {
            id
            title
            description
            startDateTime
            deadline
            endDateTime
            url
        }
    }
`;

/* const ALL_LISTING_IDS = gql`
    query allListingIDs {
        allListings {
            id
        }
    }
`;

export const getStaticPaths: GetStaticPaths = async () => {
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
