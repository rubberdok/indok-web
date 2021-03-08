import { Organization, Listing } from "@interfaces/listings";
import { ORGANIZATION_LISTINGS } from "@graphql/listings/queries";
import { DELETE_LISTING } from "@graphql/listings/mutations";
import { useQuery, useMutation } from "@apollo/client";
import Link from "next/link";

const OrganizationListings: React.FC<{ organization: Organization }> = ({ organization }) => {
  const { loading, error, data } = useQuery<{ organization: { listings: Listing[] } }>(ORGANIZATION_LISTINGS, {
    variables: {
      ID: organization.id,
    },
  });
  const [deleteListing] = useMutation<{ deleteListing: { ok: boolean; listingId: string } }>(DELETE_LISTING, {
    update: (cache, { data }) => {
      data &&
        cache.modify({
          fields: {
            listings: (existingListings: { __ref: string }[]) => {
              console.log(existingListings);
              return existingListings.filter((listing) => listing.__ref.split(":")[1] !== data.deleteListing.listingId);
            },
          },
        });
    },
  });
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <>
          {data.organization.listings.length !== 0 ? (
            <ul>
              {data.organization.listings.map((listing) => (
                <li key={listing.id}>
                  <Link href={`/org/${organization.id}/listings/${listing.id}`}>{listing.title}</Link>{" "}
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
                  <br />
                  <p>Søknader: {listing.responses ? listing.responses.length : 0}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Ingen åpne verv</p>
          )}
        </>
      )}
    </>
  );
};

export default OrganizationListings;
