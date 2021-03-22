import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import {
  Button,
  Container,
  Grid,
  Hidden,
  makeStyles,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@material-ui/core";
import ArrowForward from "@material-ui/icons/ArrowForward";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import { NextPage } from "next";
import { useRouter } from "next/router";
import AnswerSurvey from "@components/pages/surveys/answerSurvey";
import { useState } from "react";
import OrganizationInfoPanel from "@components/pages/listings/detail/organizationInfoPanel";
import InlineOrganizationInfoPanel from "@components/pages/listings/detail/inlineOrganizationInfoPanel";
import ListingBody from "@components/pages/listings/detail/listingBody";
import Hero from "@components/pages/listings/detail/hero";
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
    variables: { ID: parseInt(listingId as string) },
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
              img="img/bindeleddet.jpg"
              title={data.listing.title}
              subtitle1={data.listing.organization?.name}
              subtitle2={dayjs(data.listing.deadline).format("DD. MMMM YYYY, kl. HH:mm")}
              buttonText="Søk her"
            />
          </Hidden>
          <Container>
            <Card>
              <CardContent>
                <Grid container direction="column" alignItems="center">
                  <Grid item>
                    <Typography variant="subtitle1" component="h1">
                      {data.listing.title}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="overline" component="span">
                      {data.listing.organization.name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="overline" component="span">
                      {dayjs(data.listing.deadline).format("DD. MMMM YYYY, kl. HH:mm")}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary" endIcon={<ArrowForward />}>
                      Søk her
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card></Card>
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
    variables: { ID: listingId },
  });
  return {
    props: { data.listing },
  };
}; */
