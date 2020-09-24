import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";

const ALL_LISTINGS = gql`
    query allListings {
        listings {
            id
            title
            description
            startDateTime
            endDateTime
            url
        }
    }
`;
const ADD_LISTING = gql`
    mutation exampleListing {
        createListing(
            title: "example"
            description: "desc"
            startDateTime: "2020-09-24T11:00:00+00:00"
            endDateTime: "2020-09-24T11:00:00+00:00"
            url: "www.google.com"
        ) {
            listing {
                title
                description
                startDateTime
                endDateTime
                url
            }
            ok
        }
    }
`;

interface Listing {
    title: string;
    id: string;
}

const Listings: NextPage = () => {
    const { loading, error, data } = useQuery(ALL_LISTINGS);
    const [addListing] = useMutation(ADD_LISTING);
    if (error) {
        return <h1>Error</h1>;
    }
    if (loading) {
        return <h1>Loading...</h1>;
    }
    return (
        <Layout>
            <button
                onClick={() => {
                    addListing();
                }}
            >
                Test
            </button>
            <ul>
                {data.listings &&
                    data.listings.map(({ id, title }: Listing) => (
                        <li>
                            <Link href={`/listings/${id}`}>
                                <a>{title}</a>
                            </Link>
                        </li>
                    ))}
            </ul>
        </Layout>
    );
};

export default Listings;
