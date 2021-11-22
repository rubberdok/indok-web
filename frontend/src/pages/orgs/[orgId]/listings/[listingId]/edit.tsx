import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import ListingForm from "@components/pages/listings/organization/ListingForm";
import { UPDATE_LISTING } from "@graphql/listings/mutations";
import { LISTING } from "@graphql/listings/queries";
import { Listing, ListingInput } from "@interfaces/listings";
import { Container, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Oslo");

/**
 * Page for editing an existing listing.
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
        startDatetime: dayjs(data.listing.startDatetime).utc().local().format("YYYY-MM-DDTHH:mm"),
        deadline: dayjs(data.listing.deadline).utc().local().format("YYYY-MM-DDTHH:mm"),
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
        <Grid container justifyContent="center">
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
                        applicationUrl: listing.applicationUrl || undefined,
                        startDatetime: listing.startDatetime || undefined,
                        deadline: listing.deadline || undefined,
                        application: listing.application || undefined,
                        interview: listing.interview || undefined,
                        case: listing.case || undefined,
                        readMoreUrl: listing.readMoreUrl || undefined,
                      },
                    },
                  });
                }}
                onCancel={() => router.back()}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};
export default EditListingPage;
