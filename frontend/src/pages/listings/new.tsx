import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import ListingForm from "@components/pages/listings/organization/ListingForm";
import { ListingInput } from "@interfaces/listings";
import { Container, Typography, Grid } from "@material-ui/core";
import { NextPage } from "next";
import { useState } from "react";
import { Listing } from "@interfaces/listings"
import { CREATE_LISTING } from "@graphql/listings/mutations";
import { USER_WITH_ORGANIZATIONS } from "@graphql/listings/queries";
import { useRouter } from "next/router";

const EmptyListing: ListingInput = {
  id: "",
  description: "",
  title: "",
  startDatetime: "",
  deadline: "",
}

const NewListingPage: NextPage = () => {
  const router = useRouter()
  const [listing, setListing] = useState<Listing | ListingInput >(EmptyListing)
  const { loading, error, data } = useQuery(USER_WITH_ORGANIZATIONS, {
    onCompleted: (data) => setListing({...listing, organization: data.user.organizations[0]})
  })
  const [createListing] = useMutation<{createListing: { ok: boolean, listing: Listing }}>(CREATE_LISTING, {
    onCompleted: (data) => router.push(`/listings/${data.createListing.listing.id}/${data.createListing.listing.slug}`)
  })

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;
  return (
    <Layout>
      <Container>
        <Typography variant="h1" gutterBottom>
          Ny vervutlysning
        </Typography>
        <Grid container justify="center">
          <Grid item xs={10}>
            <ListingForm state={listing} setState={setListing} organizations={data.user.organizations} onSubmit={(_) => {
              createListing({
                variables: {
                  input: {
                    title: listing.title,
                    description: listing.description || undefined,
                    startDatetime: listing.startDatetime || undefined,
                    deadline: listing.deadline,
                    organizationId: listing.organization?.id
                  }
                }
              })
            }}/>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};
export default NewListingPage;
