import { useQuery } from "@apollo/client";
import Layout, { RootStyle } from "@layouts/Layout";
import { components as markdownComponents } from "@components/Markdown";
import InfoCard from "@components/pages/listings/detail/InfoCard";
import ListingBanner from "@components/pages/listings/detail/ListingBanner";
import ListingBody from "@components/pages/listings/detail/ListingBody";
import TitleCard from "@components/pages/listings/detail/TitleCard";
import { ListingDocument, ListingQuery } from "@generated/graphql";
import { Listing } from "@interfaces/listings";
import { addApolloState, initializeApollo } from "@lib/apolloClient";
import ArrowForward from "@mui/icons-material/ArrowForward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Button, Container, Grid, Hidden, Paper } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { NextPageWithLayout } from "../_app";

// page to show details about a listing and its organization
const ListingPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ listing }) => {
  const { listingId } = useRouter().query;

  // fetches the listing, using the URL parameter as the argument
  const { loading, error, data } = useQuery(ListingDocument, {
    variables: {
      id: Array.isArray(listingId) ? listingId[0] : listingId,
    },
  });

  const descriptionWithTitle = (desc: string) => {
    if (!desc.startsWith("#")) {
      return "### Om vervet\n" + desc;
    }
    return desc;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const getLink = (listing: ListingQuery["listing"]): string => {
    if (listing?.form) {
      return `/forms/${listing.form.id}`;
    }
    return listing?.applicationUrl ?? "";
  };

  return (
    <>
      <Head>
        <title>{`${listing.title} | Foreningen for Studenter ved Industriell Økonomi og Teknologiledelse`}</title>
        {listing.heroImageUrl && <meta property="og:image" content={listing.heroImageUrl} key="image" />}
        <meta
          property="og:title"
          content={`${listing.title} | Foreningen for Studenter ved Industriell Økonomi og Teknologiledelse`}
          key="title"
        />
      </Head>
      {data?.listing && (
        <>
          <Hidden smDown>
            <ListingBanner imageUrl={data.listing.heroImageUrl} />
          </Hidden>
          <Container>
            <Grid container justifyContent="center">
              <Grid
                container
                item
                xs={12}
                sm={10}
                direction="column"
                alignItems="stretch"
                spacing={4}
                sx={(theme) => ({
                  position: "relative",
                  [theme.breakpoints.up("md")]: {
                    marginTop: "-7%",
                  },
                })}
              >
                <Grid container item direction="row" alignItems="stretch" justifyContent="center" spacing={4}>
                  <Hidden mdDown>
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
            <Paper
              sx={{
                position: "sticky",
                bottom: 0,
                padding: (theme) => theme.spacing(2),
                zIndex: (theme) => theme.zIndex.snackbar,
              }}
            >
              <Grid container direction="row" justifyContent="space-between" alignItems="center">
                {data.listing.readMoreUrl && (
                  <Grid item xs>
                    <Link passHref href={data.listing.readMoreUrl}>
                      <Button size="small" endIcon={<OpenInNewIcon />}>
                        {data.listing.organization.name.slice(0, 20)}
                      </Button>
                    </Link>
                  </Grid>
                )}
                <Hidden smUp>
                  {(data.listing.form || data.listing.applicationUrl) && (
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
        </>
      )}
    </>
  );
};

ListingPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export const getServerSideProps: GetServerSideProps<{ listing: Listing }> = async (ctx) => {
  const client = initializeApollo({}, ctx);
  const id = Array.isArray(ctx.params?.listingId) ? ctx.params?.listingId[0] : ctx.params?.listingId;
  const { data, error } = await client.query({
    query: ListingDocument,
    variables: {
      id,
    },
  });

  if (error) return { notFound: true };

  const { listing } = data;
  if (typeof listing === "undefined") return { notFound: true };

  return addApolloState(client, { props: { listing } });
};

ListingPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ListingPage;
