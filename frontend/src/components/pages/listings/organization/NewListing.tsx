import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import ListingForm from "@components/pages/listings/organization/ListingForm";
import { ListingInput } from "@interfaces/listings";
import { Container, Typography, Grid } from "@material-ui/core";
import { useState } from "react";
import { Listing } from "@interfaces/listings";
import { CREATE_LISTING } from "@graphql/listings/mutations";
import { USER_WITH_ORGANIZATIONS } from "@graphql/listings/queries";
import { useRouter } from "next/router";
import { Organization } from "@interfaces/organizations";

const EmptyListing: ListingInput = {
  id: "",
  description: "",
  title: "",
  startDatetime: "",
  deadline: "",
  organization: {
    name: "",
    id: "",
    color: "",
    description: "",
    slug: "",
  },
};

/**
 * @description Page for creating new listings, navigates to the newly created listing upon completion
 * @param defaultOrganizationId - Optional id of the organization for which to create the listing
 */
const NewListing: React.FC<{
  defaultOrganizationId?: string;
}> = ({ defaultOrganizationId }) => {
  const router = useRouter();

  // state to manage the listing being created
  const [listing, setListing] = useState<ListingInput>(EmptyListing);

  /**
   * @description Load the organizations to which the user belongs
   * @todo Currently assumes the user belongs to an organization, which must be the case, yet this should allow for dynamically setting the default organization.
   */
  const { loading, error, data } = useQuery<{ user: { organizations: Organization[] } }>(USER_WITH_ORGANIZATIONS, {
    onCompleted: (data) =>
      setListing({
        ...listing,
        organization:
          data.user.organizations.find((organization) => organization.id === defaultOrganizationId) ||
          data.user.organizations[0],
      }),
  });

  // Create the listing, navigate to the newly created listing upon completion.
  const [createListing] = useMutation<{ createListing: { ok: boolean; listing: Listing } }>(CREATE_LISTING, {
    onCompleted: (data) => router.push(`/listings/${data.createListing.listing.id}/${data.createListing.listing.slug}`),
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;
  return (
    <>
      <Typography variant="h1" gutterBottom>
        Ny vervutlysning
      </Typography>
      <Grid container justify="center">
        <Grid item xs={10}>
          <ListingForm
            state={listing}
            setState={setListing}
            organizations={data?.user.organizations || []}
            onSubmit={() => {
              createListing({
                variables: {
                  input: {
                    title: listing.title,
                    description: listing.description || undefined,
                    startDatetime: listing.startDatetime || undefined,
                    deadline: listing.deadline,
                    organizationId: listing.organization?.id,
                    case: listing.case || undefined,
                    interview: listing.interview || undefined,
                    application: listing.application || undefined,
                  },
                },
              });
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default NewListing;
