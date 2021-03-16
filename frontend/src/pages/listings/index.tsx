import { NextPage } from "next";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import { LISTINGS } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import Filter from "@components/pages/listings/filter";
import ListingItem from "@components/pages/listings/listingItem";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(8),
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  filter: {
    width: "100%",
  },
}));

// the page to show all listings open to users
const ListingsPage: NextPage = () => {
  const { loading, error, data } = useQuery<{ listings: Listing[] }>(LISTINGS);
  const classes = useStyles();

  // TODO: remove example organizations
  const filters = ["Bindeleddet", "Janus", "Estiem", "Hovedstyret", "Janus FK", "Indøl"];

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <Layout>
      <Container>
        <Typography variant="h1" style={{ textAlign: "center" }} className={classes.title}>
          Åpne verv på Indøk
        </Typography>
        <Grid container className={classes.container} spacing={2}>
          <Filter filters={filters} />
          <Grid item xs={8}>
            <Grid container spacing={2}>
              {data &&
                data.listings.map((listing) => (
                  <Grid item xs key={listing.id}>
                    <ListingItem listing={listing} />
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};
export default ListingsPage;
