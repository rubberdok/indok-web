import { Listing, Response } from "@interfaces/listings";
import { User } from "@interfaces/users";
import { useQuery, useMutation } from "@apollo/client";
import { SURVEY_RESPONDERS } from "@graphql/surveys/queries";
import { useState } from "react";
import OrganizationListing from "@components/pages/listings/organization/organizationListing";
import SurveyResponse from "@components/pages/surveys/surveyAdmin/surveyResponse";
import { Grid, Box, Tabs, Tab } from "@material-ui/core";

const ListingResponses: React.FC<{ listing: Listing }> = ({ listing }) => {
  const [selectedApplicant, selectApplicant] = useState<User | null>(null);
  const { loading, error, data } = useQuery<{ survey: { responders: User[] } }>(SURVEY_RESPONDERS, {
    variables: { ID: Number(listing.survey!.id) },
  });
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
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
            {data.survey.responders.map((responder, index) => (
              <Tab key={index} value={responder} label={`${responder.firstName} ${responder.lastName}`} />
            ))}
          </Tabs>
          <Box marginLeft={3}>
            {selectedApplicant ? (
              <SurveyResponse user={selectedApplicant} survey={listing.survey} />
            ) : (
              <OrganizationListing listing={listing} />
            )}
          </Box>
        </Grid>
      )}
    </>
  );
};

export default ListingResponses;
