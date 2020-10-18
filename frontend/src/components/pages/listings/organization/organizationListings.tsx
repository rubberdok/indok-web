import { Organization, Listing } from "@interfaces/listings";
import { ORGANIZATION_LISTINGS } from "@graphql/listings/queries";
import { useQuery } from "@apollo/client";
import Link from "next/link";

const OrganizationListings: React.FC<{ organization: Organization }> = ({ organization }) => {
    const { loading, error, data } = useQuery<{ organization: { listings: Listing[] } }>(ORGANIZATION_LISTINGS, {
        variables: {
            ID: organization.id,
        },
    });
    if (error) {
        console.log(error);
        return <p>Error</p>;
    }
    if (loading) return <p>Loading...</p>;
    return (
        <ul>
            {data &&
                data.organization.listings.map((listing) => (
                    <li key={listing.id}>
                        <Link href={`/org/${organization.id}/listings/${listing.id}/responses`}>{listing.title}</Link>
                        <br />
                        <p>Søknader:{listing.responses ? listing.responses.length : 0}</p>
                    </li>
                ))}
        </ul>
    );
};

export default OrganizationListings;
