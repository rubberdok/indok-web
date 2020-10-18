import { useQuery } from "@apollo/client";
import { Listing } from "@interfaces/listings";
import { LISTINGS } from "@graphql/listings/queries";
import Link from "next/link";

const AllListings: React.FC = () => {
    const { loading, error, data } = useQuery<{ listings: Listing[] }>(LISTINGS);
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
    return (
        <ul>
            {data &&
                data.listings.map((listing) => (
                    <li key={listing.id}>
                        <Link href={`/listings/${listing.id}/${listing.slug}`}>{listing.title}</Link>
                        <p>
                            {listing.organization && (
                                <>
                                    {listing.organization.name}
                                    <br />
                                </>
                            )}
                            Frist: {listing.deadline.slice(0, 16).replace("T", " ")}
                        </p>
                    </li>
                ))}
        </ul>
    );
};

export default AllListings;
