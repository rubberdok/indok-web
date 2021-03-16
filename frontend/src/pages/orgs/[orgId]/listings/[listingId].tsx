import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
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

const ListingAdminPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ listingId, orgId }) => {
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING_WITH_RESPONDERS, {
    variables: {
      ID: listingId,
    },
  });
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
            onChange={(event, applicant) => {
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

export const getServerSideProps: GetServerSideProps<{
  listingId: string;
  orgId: string;
}> = async (context) => {
  const listingId = context.query.listingId as string;
  const orgId = context.query.orgId as string;
  return {
    props: { listingId, orgId },
  };
};

export default ListingAdminPage;
