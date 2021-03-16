import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import { Button, Container, Grid, Hidden, makeStyles } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import AnswerSurvey from "@components/pages/surveys/answerSurvey";
import { useState } from "react";
import OrganizationInfoPanel from "@components/pages/listings/detail/organizationInfoPanel";
import InlineOrganizationInfoPanel from "@components/pages/listings/detail/inlineOrganizationInfoPanel";
import ListingBody from "@components/pages/listings/detail/listingBody";

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
          <Container>
            <Container className={classes.container}>
              <Grid container className={classes.root} spacing={2}>
                {data.listing.organization && (
                  <>
                    <Hidden smDown>
                      <Grid item md={4}>
                        <OrganizationInfoPanel organization={data.listing.organization} />
                      </Grid>
                    </Hidden>
                    <Hidden mdUp>
                      <Grid item sm={12}>
                        <InlineOrganizationInfoPanel organization={data.listing.organization} />
                      </Grid>
                    </Hidden>
                  </>
                )}
                <Grid container item direction="column" sm={12} md={8}>
                  <ListingBody listing={data.listing} />
                  <Button variant="contained" color="primary" onClick={() => displaySurvey(!surveyDisplayed)}>
                    Søk her
                  </Button>
                  {data.listing.survey && surveyDisplayed && <AnswerSurvey surveyId={data.listing.survey.id} />}
                </Grid>
              </Grid>
            </Container>
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
