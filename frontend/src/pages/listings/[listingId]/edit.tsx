import { NextPage } from "next";
import Layout from "@components/Layout";
import { Container, Grid, CircularProgress, Typography } from "@material-ui/core";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { LISTING } from "@graphql/listings/queries";
import { useRouter } from "next/router";
import EditListing from "@components/pages/listings/detail/EditListing";
import { ListingInput } from "@interfaces/listings"

const EmptyListing: ListingInput = {
  title: "",
  description: "",
  startDatetime: "",
}

const Edit: NextPage = () => {
  const { listingId } = useRouter().query;

  // fetches the listing, using the URL parameter as the argument
  const { loading, error, data } = useQuery<{ listing: ListingInput }>(LISTING, {
    variables: { id: listingId },
  });
  
  const [listingState, setListingState] = useState(data?.listing || EmptyListing)
  
  useEffect(() => {
    setListingState(listingState)
  }, [listingState]);
  
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <Layout>
      <Container>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid container item xs={10} direction="column">
            {loading &&
              <CircularProgress color="primary" />
            }
            {error &&
              <Typography variant="caption">
                Nå har det skjedd noe gærnt her.
              </Typography>
            }
            {data &&
              <EditListing listingState={listingState} setListingState={setListingState} />
            }
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
};


export default Edit;