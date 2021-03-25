import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import ListingItem from "@components/pages/listings/listingItem";
import { LISTINGS } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { NextPage } from "next";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  hero: {
    color: "white",
    height: "30vh",
    width: "100%",
    backgroundColor: "black",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.8)), url('img/bindeleddet.jpg')`,
    marginBottom: 20,
  },
}));

// the page to show all listings open to users
const ListingsPage: NextPage = () => {
  const { loading, error, data } = useQuery<{ listings: Listing[] }>(LISTINGS);
  const classes = useStyles();

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <Layout>
      <Container>
        <Typography variant="h1" component="h1" align="center">
          Verv
        </Typography>
        <Grid container direction="row" spacing={2} className={classes.root} justify="center" alignItems="stretch">
          {data &&
            data.listings.map((listing) => (
              <>
                <Grid container item key={listing.id} md={5} sm={7} xs={10}>
                  <ListingItem listing={listing} />
                </Grid>
              </>
            ))}
        </Grid>
      </Container>
    </Layout>
  );
};
export default ListingsPage;
