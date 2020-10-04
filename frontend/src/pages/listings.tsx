import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { useQuery, useMutation } from "@apollo/client";
import { ListingType, ListingData } from "../interfaces/listings";
import { ALL_LISTINGS } from "../graphql/listings/queries";
import { ADD_EXAMPLE_LISTING } from "../graphql/listings/mutations";

const Listings: NextPage = () => {
    const { loading, error, data } = useQuery<ListingData>(ALL_LISTINGS);
    const [addExampleListing] = useMutation<ListingData>(ADD_EXAMPLE_LISTING, {
        update: (cache, { data }) => {
            const existingListings: ListingData | null = cache.readQuery({
                query: ALL_LISTINGS,
            });
            const newListing = data && data.createListing.listing;
            cache.writeQuery({
                query: ALL_LISTINGS,
                data: { allListings: [...existingListings!.allListings, newListing] },
            });
        },
    });
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
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
                {data!.allListings &&
                    data!.allListings.map((listing: ListingType) => (
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
