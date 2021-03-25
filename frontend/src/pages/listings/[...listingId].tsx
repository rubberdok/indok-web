import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import Banner from "@components/pages/listings/detail/banner";
import ListingBanner from "@components/pages/listings/detail/listingBanner";
import ListingBody from "@components/pages/listings/detail/listingBody";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import { Button, Container, Grid, Hidden, makeStyles, Paper } from "@material-ui/core";
import ArrowForward from "@material-ui/icons/ArrowForward";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import { NextPage } from "next";
import { useRouter } from "next/router";

dayjs.locale(nb);

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(4)
    }
  },
  bottom: {
    position: "sticky",
    bottom: 0,
    padding: theme.spacing(2),
    zIndex: 100,
  },
}));

// the page to show details about a listing and its organization
const ListingPage: NextPage = () => {
  const { listingId } = useRouter().query;
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, {
    variables: { id: parseInt(listingId as string) },
  });
  const classes = useStyles();

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <Layout>
          <Hidden smDown>
            <Banner listing={data.listing} />
          </Hidden>
          <Container className={classes.container}>
            <Grid container direction="column" spacing={4}>
              <Grid container item direction="row" justify="center">
                <ListingBanner listing={data.listing} />
              </Grid>
              <Grid container item direction="row" justify="center">
                <ListingBody listing={data.listing} />
              </Grid>
            </Grid>
          </Container>
          <Hidden mdUp>
            <Paper className={classes.bottom}>
              <Grid container direction="row" justify="space-between" alignItems="center">
                {data.listing.organization &&
                  <Grid item xs>
                    <Button size="small" endIcon={<OpenInNewIcon />} href={`/about/organizations/${data.listing.organization.slug}/`}>
                      {data.listing.organization.name.slice(0, 20)}
                    </Button>
                  </Grid>
                }
                <Hidden smUp>
                  {data.listing.url &&
                    <Grid item>
                      <Button variant="contained" color="primary" href={data.listing.url} endIcon={<ArrowForward />}>
                        Søk her
                      </Button>
                    </Grid>
                  }
                </Hidden>
              </Grid>
            </Paper>
          </Hidden>
        </Layout>
      )}
    </>
  );
};

export default ListingPage;

// TODO: implement server-side rendering once Apollo client is exported
/* export const getServerSideProps: GetServerSideProps<{ listingId: string }> = async (context) => {
  const listingId = parseInt(context.query.listingId as string);
  const { data } = client.query({
    query: LISTING,
    variables: { id: listingId },
  });
  return {
    props: { data.listing },
  };
}; */
