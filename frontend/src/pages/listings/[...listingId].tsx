import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import {
  Container,
  Hidden,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Hero from "@components/pages/listings/detail/hero";
import ListingBody from "@components/pages/listings/detail/listingBody";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
dayjs.locale(nb);

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flexDirection: "column",
    padding: theme.spacing(4),
  },
  wrapper: {
    flexDirection: "row",
    padding: theme.spacing(4),
  },
  root: {
    spacing: 2,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      justifyContent: "flex-start",
    },
    [theme.breakpoints.up("md")]: {
      justifyContent: "space-between",
      flexDirection: "row-reverse",
    },
  },
}));

// the page to show details about a listing and its organization, and let the user apply to the listing
const ListingPage: NextPage = () => {
  const { listingId } = useRouter().query;
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, {
    variables: { id: parseInt(listingId as string) },
  });
  const classes = useStyles();

  // state to determine whether to show the survey (where the user applies to the listing)
  const [surveyDisplayed, displaySurvey] = useState<boolean>(false);

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <Layout>
          <Hidden smDown>
            <Hero
              listing={data.listing}
              buttonText="Søk her"
            />
          </Hidden>
          <Container className={classes.container}>
              <ListingBody listing={data.listing} />
          </Container>
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
