import { NextPage } from "next";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import { LISTINGS } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import { Container, Grid, makeStyles, Typography, Box, Card, CardContent } from "@material-ui/core";
import Filter from "@components/pages/listings/filter";
import ListingItem from "@components/pages/listings/listingItem";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(8),
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
      <Grid container className={classes.hero} alignItems="center" justify="center">
        <Grid xs={12} sm={6} item container justify="center">
          <Box>
            <Typography variant="h1">Verv</Typography>
            <Typography variant="overline">Oversikt over åpne verv på Indøk</Typography>
          </Box>
        </Grid>
        <Grid xs={12} sm={6} item container justify="center">
          {/*<Link href="/cabins/book" passHref>
            <Button variant="contained" endIcon={<NavigateNextIcon />}>
              Book nå
            </Button>
          </Link> */}
        </Grid>
      </Grid>
      <Container>
        <Grid container className={classes.container} spacing={2}>
          <Filter filters={filters} />
          <Grid item xs={8}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  {data &&
                    data.listings.map((listing) => (
                      <Grid item xs key={listing.id}>
                        <ListingItem listing={listing} />
                      </Grid>
                    ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};
export default ListingsPage;
