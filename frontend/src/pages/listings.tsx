import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { useQuery, useMutation } from "@apollo/client";
import ListingType from "../components/pages/listings/listingType";
import { ALL_LISTINGS } from "../graphql/listings/queries";
import { ADD_EXAMPLE_LISTING } from "../graphql/listings/mutations";

const Listings: NextPage = () => {
    const { loading, error, data } = useQuery(ALL_LISTINGS);
    const [addExampleListing] = useMutation(ADD_EXAMPLE_LISTING);
    if (error) return <h1>Error</h1>;
    if (loading) return <h1>Loading...</h1>;
    return (
        <Layout>
            <button
                onClick={() => {
                    addExampleListing();
                }}
            >
                Test
            </button>
            <ul>
                {data.allListings &&
                    data.allListings.map((listing: ListingType) => (
                        <li key={listing.id}>
                            <Link href={`/listings/${listing.id}/${listing.slug}`}>
                                <a>{listing.title}</a>
                            </Link>
                        </li>
                    ))}
            </ul>
        </Layout>
    );
};

export default Listings;
