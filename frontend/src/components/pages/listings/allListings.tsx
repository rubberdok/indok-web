import { useQuery } from "@apollo/client";
import { AllListingsData } from "@interfaces/listings";
import { ALL_LISTINGS } from "@graphql/listings/queries";
import Link from "next/link";

const AllListings = () => {
    const { loading, error, data } = useQuery<AllListingsData>(ALL_LISTINGS);
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
    return (
        <ul>
            {data!.allListings.map((listing) => (
                <li>
                    <Link href={`/listings/${listing.id}/${listing.slug}`}>
                        <a>{listing.title}</a>
                    </Link>
                    <p>
                        {listing.organization && listing.organization.name}
                        Frist: {listing.deadline.slice(0, 16).replace("T", " ")}
                    </p>
                </li>
            ))}
        </ul>
    );
};

export default AllListings;
