import { Listing } from "@interfaces/listings";
import { useState } from "react";
import EditSurvey from "@components/pages/surveys/surveyAdmin/editSurvey";
import { Survey } from "@interfaces/surveys";
import { CREATE_SURVEY } from "@graphql/surveys/mutations";
import { useMutation } from "@apollo/client";
import { UPDATE_LISTING } from "@graphql/listings/mutations";
import { Button, Typography } from "@material-ui/core";

// component for authorized organization members to administer their listing
// TODO: functionality to edit the listing's name/description
const OrganizationListing: React.FC<{ listing: Listing }> = ({ listing }) => {
  // state to determine whether to show the listing's survey (where the user applies)
  const [surveyShown, showSurvey] = useState(false);

  // mutation to create a new survey
  // TODO: update cache on create
  const [createSurvey, { data: surveyData }] = useMutation<{ createSurvey: { survey: Survey } }>(CREATE_SURVEY);

  // if the listing has no survey, shows create button; otherwise, shows button to show the survey
  return (
    <>
      <Typography variant="h3">{listing.title}</Typography>
      <Typography>{listing.description}</Typography>
      {listing.survey ? (
        <Button
          onClick={(e) => {
            e.preventDefault();
            if (surveyData && !listing.survey) {
              listing.survey = surveyData.createSurvey.survey;
            }
            showSurvey(!surveyShown);
          }}
        >
          {surveyShown ? "Gjem søknad" : "Vis søknad"}
        </Button>
      ) : (
        <Button
          onClick={(e) => {
            e.preventDefault();
            createSurvey({
              variables: {
                descriptiveName: `Søknad: ${listing.title}`,
                description: "",
                listingId: listing.id,
              },
            });
          }}
        >
          Lag søknad
        </Button>
      )}
      {surveyShown && listing.survey && <EditSurvey surveyId={listing.survey.id} />}
    </>
  );
};

export default OrganizationListing;
