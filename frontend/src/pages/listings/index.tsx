import { NextPage } from "next";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import { LISTINGS } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import ListingItem from "@components/pages/listings/listingItem";
import { Container, Grid, makeStyles, Typography, Hidden } from "@material-ui/core";

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
        <Grid container direction="row" spacing={2} className={classes.root} justify="center" alignItems="stretch">
          {data &&
            data.listings.map((listing) => (
              <>
                <Hidden smDown>
                  <Grid container item key={listing.id} xs={5}>
                    <ListingItem listing={listing} />
                  </Grid>
                </Hidden>
                <Hidden mdUp xsDown>
                  <Grid container item key={listing.id} xs={7}>
                    <ListingItem listing={listing} />
                  </Grid>
                </Hidden>
                <Hidden smUp>
                  <Grid container item key={listing.id} xs={10}>
                    <ListingItem listing={listing} />
                  </Grid>
                </Hidden>
              </>
            ))}
        </Grid>
      </Container>
    </Layout>
  );
};
export default ListingsPage;
