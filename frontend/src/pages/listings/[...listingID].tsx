import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Hidden,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
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

const ListingPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ listingID }) => {
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, {
    variables: { ID: Number(listingID[0]) },
  });
  const classes = useStyles();
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

export const getServerSideProps: GetServerSideProps<{ listingID: string }> = async (context) => {
  const listingID = context.query.listingID as string;
  return {
    props: { listingID },
  };
};
