import { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/Layout";
import AllListings from "@components/pages/listings/allListings";
import CreateListing from "@components/pages/listings/createListing";

const Listings: NextPage = () => {
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
    return (
        <Layout>
            <CreateListing />
            <AllListings />
        </Layout>
    );
};

export default Listings;
