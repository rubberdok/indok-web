import { useQuery } from "@apollo/client";
import { ListingsData } from "@interfaces/listings";
import { LISTINGS } from "@graphql/listings/queries";
import Link from "next/link";

const AllListings = () => {
    const { loading, error, data } = useQuery<ListingsData>(LISTINGS);
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
    return (
        <ul>
            {data!.listings.map((listing) => (
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
