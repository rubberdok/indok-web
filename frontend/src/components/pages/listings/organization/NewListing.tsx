import { useMutation, useQuery } from "@apollo/client";
import { Container, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

import { ListingForm } from "@/components/pages/listings/organization/ListingForm";
import { CreateListingDocument, UserOrganizationsDocument } from "@/generated/graphql";

import { ListingInput } from "@/types/listings";

const emptyListing: ListingInput = {
  id: "",
  description: "",
  title: "",
  startDatetime: "",
  deadline: "",
  applicationUrl: "",
  organization: {
    name: "",
    id: "",
    color: "",
    description: "",
    slug: "",
  },
};

type Props = { defaultOrganizationId?: string };

/** Page for creating new listings, navigates to the newly created listing upon completion. */
export const NewListing: React.FC<Props> = ({ defaultOrganizationId }) => {
  const router = useRouter();

  // state to manage the listing being created
  const [listing, setListing] = useState<ListingInput>(emptyListing);

  /**
   * Load the organizations to which the user belongs.
   * @todo Currently assumes the user belongs to an organization, which must be the case, yet this should allow for dynamically setting the default organization.
   */
  const { loading, error, data } = useQuery(UserOrganizationsDocument, {
    onCompleted: (data) => {
      const user = data.user;
      if (user) {
        setListing({
          ...listing,
          organization:
            user.organizations.find((organization) => organization.id === defaultOrganizationId) ||
            user.organizations[0],
        });
      }
    },
  });

  // Create the listing, navigate to the newly created listing upon completion.
  const [createListing] = useMutation(CreateListingDocument, {
    onCompleted: (data) => {
      const listingId = data.createListing?.listing?.id;
      if (listingId) router.push(`/orgs/${listing.organization.id}/listings/${listingId}`);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;
  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        Ny vervutlysning
      </Typography>
      <Grid container justifyContent="center">
        <Grid item xs={10}>
          <ListingForm
            listing={listing}
            setListing={setListing}
            organizations={data?.user?.organizations || []}
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
                    applicationUrl: listing.applicationUrl || undefined,
                    readMoreUrl: listing.readMoreUrl || undefined,
                  },
                },
              });
            }}
            onCancel={() => router.back()}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
