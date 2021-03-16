import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Listing } from "@interfaces/listings";
import { LISTING_WITH_RESPONDERS } from "@graphql/listings/queries";
import Link from "next/link";
import Layout from "@components/Layout";
import { Grid, Box, Tabs, Tab } from "@material-ui/core";
import { useState } from "react";
import { User } from "@interfaces/users";
import SurveyAnswers from "@components/pages/surveys/surveyAdmin/surveyAnswers";
import OrganizationListing from "@components/pages/listings/organization/organizationListing";

// the page for organization admins to administer a listing, edit its survey, and review applicants
const ListingAdminPage: NextPage = () => {
  const { orgId, listingId } = useRouter().query;

  // fetches the listing along with all users who have applied to it
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING_WITH_RESPONDERS, {
    variables: {
      ID: parseInt(listingId as string),
    },
  });

  // state to determine whether to show the applicant view or the listing/survey view
  const [selectedApplicant, selectApplicant] = useState<User | null>(null);

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <Layout>
      <Link href={`/orgs/${orgId}/listings`}>Tilbake</Link>
      {data && (
        <Grid container direction="row">
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
          <Box marginLeft={3}>
            {selectedApplicant ? (
              <>
                {data.listing.survey && (
                  <SurveyAnswers user={selectedApplicant} surveyId={parseInt(data.listing.survey.id)} />
                )}
              </>
            ) : (
              <OrganizationListing listing={data.listing} />
            )}
          </Box>
        </Grid>
      )}
    </Layout>
  );
};

export default ListingAdminPage;
