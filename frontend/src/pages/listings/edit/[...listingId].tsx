import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import ListingForm from "@components/pages/listings/organization/ListingForm";
import { Container, Typography, Grid } from "@material-ui/core";
import { NextPage } from "next";
import { useState } from "react";
import { Listing, ListingInput } from "@interfaces/listings";
import { UPDATE_LISTING } from "@graphql/listings/mutations";
import { LISTING_AND_USER_WITH_ORGANIZATIONS } from "@graphql/listings/queries";
import { useRouter } from "next/router";
import { Organization } from "@interfaces/organizations";

const EditListingPage: NextPage = () => {
  const router = useRouter();
  const { listingId } = router.query;

  const [listing, setListing] = useState<ListingInput | undefined>(undefined);
  const { loading, error, data } = useQuery<{ listing: Listing; user: { organizations: Organization[] } }>(
    LISTING_AND_USER_WITH_ORGANIZATIONS,
    {
      variables: { id: parseInt(listingId as string) },
      onCompleted: (data) => setListing(data.listing as ListingInput),
    }
  );

  const [updateListing] = useMutation<{ updateListing: { ok: boolean; listing: Listing } }>(UPDATE_LISTING, {
    onCompleted: (data) => router.push(`/listings/${data.updateListing.listing.id}/${data.updateListing.listing.slug}`),
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

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
                state={listing}
                setState={setListing}
                organizations={data?.user.organizations}
                onSubmit={(e) => {
                  e.preventDefault();
                  updateListing({
                    variables: {
                      id: listing.id,
                      input: {
                        title: listing.title || undefined,
                        description: listing.description || undefined,
                        url: listing.url || undefined,
                        startDatetime: listing.startDatetime || undefined,
                        deadline: listing.deadline || undefined,
                        organizationId: listing.organization?.id || undefined,
                        case: listing.case || undefined,
                        interview: listing.interview || undefined,
                        application: listing.application || undefined,
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
