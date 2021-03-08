import { Listing } from "@interfaces/listings";
import { useState } from "react";
import EditSurvey from "@components/pages/surveys/surveyAdmin/editSurvey";
import { Survey } from "@interfaces/surveys";
import { CREATE_SURVEY } from "@graphql/surveys/mutations";
import { useMutation } from "@apollo/client";
import { UPDATE_LISTING } from "@graphql/listings/mutations";
import { Button } from "@material-ui/core";

const OrganizationListing: React.FC<{ listing: Listing }> = ({ listing }) => {
  const [surveyShown, showSurvey] = useState(false);
  const [createSurvey, { data: surveyData }] = useMutation<{ createSurvey: { survey: Survey } }>(CREATE_SURVEY);
  return (
    <>
      <h3>{listing.title}</h3>
      <p>{listing.description}</p>
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
