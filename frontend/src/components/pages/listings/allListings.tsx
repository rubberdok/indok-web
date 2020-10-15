import { useQuery, useMutation } from "@apollo/client";
import { Listing } from "@interfaces/listings";
import { LISTINGS } from "@graphql/listings/queries";
import { DELETE_LISTING } from "@graphql/listings/mutations";
import Link from "next/link";

const AllListings: React.FC = () => {
    const { loading, error, data } = useQuery<{ listings: Listing[] }>(LISTINGS);
    const [deleteListing] = useMutation<{ deleteListing: { ok: boolean; listingId: string } }>(DELETE_LISTING, {
        update: (cache, { data }) => {
            cache.modify({
                fields: {
                    listings: (existingListings: { __ref: string }[]) => {
                        console.log(existingListings);
                        return existingListings.filter(
                            (listing) => listing.__ref.split(":")[1] !== data!.deleteListing.listingId
                        );
                    },
                },
            });
        },
    });
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
    return (
        <ul>
            {data!.listings.map((listing) => (
                <li key={listing.id}>
                    <Link href={`/listings/${listing.id}/${listing.slug}`}>{listing.title}</Link>
                    <p>
                        {listing.organization && listing.organization.name}
                        Frist: {listing.deadline.slice(0, 16).replace("T", " ")}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                deleteListing({
                                    variables: {
                                        ID: listing.id,
                                    },
                                });
                            }}
                        >
                            Slett
                        </button>
                    </p>
                </li>
            ))}
        </ul>
    );
};

export default AllListings;
