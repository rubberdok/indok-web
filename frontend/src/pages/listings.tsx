import { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import { ListingType, AllListingsData } from "@interfaces/listings";
import { ALL_LISTINGS } from "@graphql/listings/queries";
import CreateListing from "@components/pages/listings/createlisting";

const Listings: NextPage = () => {
    const { loading, error, data } = useQuery<AllListingsData>(ALL_LISTINGS);
    /* TODO: implement update in CreateListing
    const [addExampleListing] = useMutation<CreateListingData>(ADD_EXAMPLE_LISTING, {
        update: (cache, { data }) => {
            cache.modify({
                fields: {
                    allListings: (existingListings) => {
                        const newListing = cache.writeFragment<ListingType>({
                            data: data!.createListing.listing,
                            fragment: LISTING_FRAGMENT,
                        });
                        return [...existingListings, newListing];
                    },
                },
            });
        },
    }); */
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
    return (
        <Layout>
            <CreateListing />
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
