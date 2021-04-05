import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Listing } from "@interfaces/listings";
import { LISTING_WITH_RESPONDERS } from "@graphql/listings/queries";
import Link from "next/link";
import Layout from "@components/Layout";
import { makeStyles, Grid, Tabs, Tab, Container, Card, CardContent } from "@material-ui/core";
import { useState } from "react";
import { User } from "@interfaces/users";
import SurveyAnswers from "@components/surveys/surveyAdmin/SurveyAnswers";
import OrganizationListing from "@components/pages/listings/organization/OrganizationListing";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
}));

// the page for organization admins to administer a listing, edit its survey, and review applicants
const ListingAdminPage: NextPage = () => {
  const { orgId, listingId } = useRouter().query;

  const classes = useStyles();

  // fetches the listing along with all users who have applied to it, using URL parameter as argument
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING_WITH_RESPONDERS, {
    variables: {
      id: parseInt(listingId as string),
    },
  });

  // state to determine whether to show the applicant view or the listing/survey view
  const [selectedApplicant, selectApplicant] = useState<User | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  // renders an overview of applicants, and either an applicant's application or the listing itself (depending on selectedApplicant state)
  return (
    <Layout>
      <Container className={classes.container}>
        <Link href={`/orgs/${orgId}`}>Tilbake</Link>
        {data && (
          <Grid container direction="row" justify="center">
            <Grid item xs={2}>
              <Card>
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={selectedApplicant}
                  onChange={(_, applicant) => {
                    selectApplicant(applicant);
                  }}
                >
                  <Tab value={null} label="Se verv og søknad" />
                  {data.listing.survey?.responders.map((responder, index) => (
                    <Tab key={index} value={responder} label={`${responder.firstName} ${responder.lastName}`} />
                  ))}
                </Tabs>
              </Card>
            </Grid>
            <Grid item xs={8}>
              <Card>
                <CardContent>
                  {selectedApplicant ? (
                    <>
                      {data.listing.survey && (
                        <SurveyAnswers user={selectedApplicant} surveyId={parseInt(data.listing.survey.id)} />
                      )}
                    </>
                  ) : (
                    <OrganizationListing listing={data.listing} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default ListingAdminPage;
