import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { gql, useQuery, useMutation } from "@apollo/client";

const ALL_LISTINGS = gql`
    query allListings {
        allListings {
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
const ADD_LISTING = gql`
    mutation exampleListing {
        createListing(
            title: "example"
            description: "desc"
            startDateTime: "2020-09-24T11:00:00+00:00"
            deadline: "2020-09-24T11:00:00+00:00"
            endDateTime: "2020-09-24T11:00:00+00:00"
            url: "www.google.com"
        ) {
            listing {
                title
                description
                startDateTime
                deadline
                endDateTime
                url
            }
            ok
        }
    }
`;

interface Listing {
    id: string;
    title: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    url: string;
}

const Listings: NextPage = () => {
    const { loading, error, data } = useQuery(ALL_LISTINGS);
    const [addListing] = useMutation(ADD_LISTING);
    if (error) return <h1>Error</h1>;
    if (loading) return <h1>Loading...</h1>;
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
                {data.allListings &&
                    data.allListings.map((listing: Listing) => (
                        <li key={listing.id}>
                            <Link href={`/listings/${listing.id}`}>
                                <a>{listing.title}</a>
                            </Link>
                        </li>
                    ))}
            </ul>
        </Layout>
    );
};

export default Listings;
