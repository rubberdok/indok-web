import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import ListingForm from "@components/pages/listings/organization/ListingForm";
import { Container, Typography, Grid } from "@material-ui/core";
import { NextPage } from "next";
import { useState } from "react";
import { Listing, ListingInput } from "@interfaces/listings";
import { UPDATE_LISTING } from "@graphql/listings/mutations";
import { useRouter } from "next/router";
import { LISTING } from "@graphql/listings/queries";

/**
 * @description Page for editing an existing listing
 */
const EditListingPage: NextPage = () => {
  const router = useRouter();
  const { listingId } = router.query;

  const [listing, setListing] = useState<ListingInput | undefined>(undefined);

  // Load the listing and set the state on completion
  const { loading, error } = useQuery<{ listing: Listing }>(LISTING, {
    variables: { id: listingId as string },
    onCompleted: (data) =>
      setListing({
        ...(data.listing as ListingInput),
        startDatetime: data.listing.startDatetime.slice(0, 10),
        deadline: data.listing.deadline.slice(0, 10),
        application: data.listing.chips.includes("application"),
        interview: data.listing.chips.includes("interview"),
        case: data.listing.chips.includes("case"),
      }),
  });

  // Return to the previous page after updating.
  const [updateListing] = useMutation<{ updateListing: { ok: boolean; listing: Listing } }>(UPDATE_LISTING, {
    onCompleted: () => router.back(),
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <Layout>
      <Container>
        <Typography variant="h1" gutterBottom>
          Oppdater vervutlysningen
        </Typography>
        <Grid container justify="center">
          <Grid item xs={10}>
            {listing && (
              <ListingForm
                listing={listing}
                setListing={setListing}
                organizations={[listing.organization]}
                onSubmit={(e) => {
                  e.preventDefault();
                  updateListing({
                    variables: {
                      id: listing.id,
                      input: {
                        title: listing.title || undefined,
                        description: listing.description || undefined,
                        url: listing.url || undefined,
                        startDatetime: listing.startDatetime ? `${listing.startDatetime}T00:00:00+02:00` : undefined,
                        deadline: listing.deadline ? `${listing.deadline}T23:59:00+02:00` : undefined,
                        application: listing.application || undefined,
                        interview: listing.interview || undefined,
                        case: listing.case || undefined,
                      },
                    },
                  });
                }}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};
export default EditListingPage;
