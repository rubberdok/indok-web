import { NextPage } from "next";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import { LISTINGS } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import { Container, Grid, makeStyles, Typography, Box, Card, CardContent } from "@material-ui/core";
import Filter from "@components/pages/listings/filter";
import ListingItemCard from "@components/pages/listings/listingItemCard";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
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
        <Grid container direction="column" spacing={2} className={classes.root}>
          {data &&
            data.listings.map((listing) => (
              <Grid item key={listing.id}>
                <ListingItemCard
                  title={listing.title}
                  subtitle={listing.description}
                  chips={["intervju", "case", "søknad"]}
                  number={15}
                  img={"img/tindoklogo.png"}
                />
              </Grid>
            ))}
        </Grid>
      </Container>
    </Layout>
  );
};
export default ListingsPage;
