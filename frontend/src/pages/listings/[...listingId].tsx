import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import * as markdownComponents from "@components/markdown/components";
import InfoCard from "@components/pages/listings/detail/InfoCard";
import ListingBanner from "@components/pages/listings/detail/ListingBanner";
import ListingBody from "@components/pages/listings/detail/ListingBody";
import TitleCard from "@components/pages/listings/detail/TitleCard";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import { Button, Container, Grid, Hidden, makeStyles, Paper } from "@material-ui/core";
import ArrowForward from "@material-ui/icons/ArrowForward";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(4),
    },
  },
  root: {
    position: "relative",
    [theme.breakpoints.up("md")]: {
      marginTop: "-7%",
    },
  },
  bottom: {
    position: "sticky",
    bottom: 0,
    padding: theme.spacing(2),
    zIndex: theme.zIndex.snackbar,
  },
  description: {
    wordBreak: "break-word",
  },
}));

// page to show details about a listing and its organization
const ListingPage: NextPage = () => {
  const { listingId } = useRouter().query;

  // fetches the listing, using the URL parameter as the argument
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, {
    variables: { id: parseInt(listingId as string) },
  });

  const classes = useStyles();

  const descriptionWithTitle = (desc: string) => {
    if (!desc.startsWith("#")) {
      return "### Om vervet\n" + desc;
    }
    return desc;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const getLink = (listing: Listing) => {
    if (listing.form) {
      return `/forms/${listing.form.id}`;
    }
    return listing.url;
  };

  return (
    <>
      {data && (
        <Layout>
          <Head>
            <title>{`${data.listing.title} | Foreningen for Studenter ved Industriell Økonomi og Teknologiledelse`}</title>
            {data.listing.heroImageUrl && <meta property="og:image" content={data.listing.heroImageUrl} key="image" />}
            <meta
              property="og:title"
              content={`${data.listing.title} | Foreningen for Studenter ved Industriell Økonomi og Teknologiledelse`}
              key="title"
            />
          </Head>
          <Hidden smDown>
            <ListingBanner listing={data.listing} />
          </Hidden>
          <Container className={classes.container}>
            <Grid container justifyContent="center">
              <Grid
                container
                item
                xs={12}
                sm={10}
                direction="column"
                alignItems="stretch"
                spacing={4}
                className={classes.root}
              >
                <Grid container item direction="row" alignItems="stretch" justifyContent="center" spacing={4}>
                  <Hidden smDown>
                    <Grid item xs={4}>
                      <InfoCard listing={data.listing} />
                    </Grid>
                  </Hidden>
                  <Grid item xs>
                    <TitleCard listing={data.listing} />
                  </Grid>
                </Grid>
                <Grid item>
                  <ListingBody>
                    <ReactMarkdown components={markdownComponents}>
                      {descriptionWithTitle(data.listing.description)}
                    </ReactMarkdown>
                  </ListingBody>
                </Grid>
              </Grid>
            </Grid>
          </Container>
          <Hidden mdUp>
            <Paper className={classes.bottom}>
              <Grid container direction="row" justifyContent="space-between" alignItems="center">
                {data.listing.organization && (
                  <Grid item xs>
                    <Button
                      size="small"
                      endIcon={<OpenInNewIcon />}
                      href={`/about/organizations/${data.listing.organization.slug}/`}
                    >
                      {data.listing.organization.name.slice(0, 20)}
                    </Button>
                  </Grid>
                )}
                <Hidden smUp>
                  {(data.listing.form || data.listing.url) && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        href={getLink(data.listing)}
                        endIcon={<ArrowForward />}
                      >
                        Søk her
                      </Button>
                    </Grid>
                  )}
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
