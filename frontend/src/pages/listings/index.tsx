import { NextPage } from "next";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import { LISTINGS } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import { Container, Grid, makeStyles, Typography, Box, Card, CardContent, Hidden } from "@material-ui/core";
import Filter from "@components/pages/listings/filter";
import ListingItemCard from "@components/pages/listings/listingItemCard";
import ListingCard from "@components/pages/listings/listingCard";

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

  // TODO: remove example organizations
  const filters = ["Bindeleddet", "Janus", "Estiem", "Hovedstyret", "Janus FK", "Indøl"];

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <Layout>
      <Container>
        <Grid container direction="column" spacing={2} className={classes.root} justify="center" alignItems="center">
          {data &&
            data.listings.map((listing) => (
              <Grid container item key={listing.id} xs={12}>
                <ListingItemCard
                  title={listing.title}
                  subtitle={listing.description}
                  chips={["intervju", "case", "søknad"]}
                  number={15}
                  img={"img/tindoklogo.png"}
                  id={listing.id}
                  slug={listing.slug}
                />
              </Grid>
            ))}
        </Grid>
        <Grid container direction="row" spacing={2} className={classes.root} justify="center" alignItems="stretch">
          {data &&
            data.listings.map((listing) => (
              <>
                <Hidden smDown>
                  <Grid container item key={listing.id} xs={6}>
                    <ListingCard
                      listing={listing}
                    />
                  </Grid>
                </Hidden>
                <Hidden mdUp xsDown>
                  <Grid container item key={listing.id} xs={8}>
                    <ListingCard 
                      listing={listing}
                    />
                  </Grid>
                </Hidden>
                <Hidden smUp>
                <Grid container item key={listing.id} xs={12}>
                    <ListingCard 
                      listing={listing}
                    />
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
