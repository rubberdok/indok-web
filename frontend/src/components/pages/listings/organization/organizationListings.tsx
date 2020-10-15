import { Organization, Listing } from "@interfaces/listings";
import { ORGANIZATION_LISTINGS } from "@graphql/listings/queries";
import { useQuery } from "@apollo/client";

const OrganizationListings: React.FC<{ organization: Organization }> = ({ organization }) => {
    const { loading, error, data } = useQuery<{ organization: { listings: Listing[] } }>(ORGANIZATION_LISTINGS, {
        variables: {
            ID: organization.id,
        },
    });
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
    return <ul>{data && data.organization.listings.map((listing) => <li key={listing.id}>{listing.title}</li>)}</ul>;
};

export default OrganizationListings;
