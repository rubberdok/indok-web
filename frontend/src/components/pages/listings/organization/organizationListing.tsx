import { Listing } from "@interfaces/listings";
import { LISTING_WITH_RESPONDERS } from "@graphql/listings/queries";
import { useState } from "react";
import EditSurvey from "@components/pages/surveys/surveyAdmin/editSurvey";
import { Survey } from "@interfaces/surveys";
import { CREATE_SURVEY } from "@graphql/surveys/mutations";
import { useMutation } from "@apollo/client";
import { Button, Typography } from "@material-ui/core";

// component for authorized organization members to administer their listing
// TODO: functionality to edit the listing's name/description
const OrganizationListing: React.FC<{ listing: Listing }> = ({ listing }) => {
  // state to determine whether to show the listing's survey (where the user applies)
  const [surveyShown, showSurvey] = useState(false);

  // mutation to create a new survey
  const [createSurvey, { data: surveyData }] = useMutation<
    { createSurvey: { ok: boolean; survey: Survey } },
    { descriptiveName: string; description: string; listingId: string }
  >(CREATE_SURVEY, {
    // updates the cache so the new survey can show instantly
    update: (cache, { data }) => {
      const newSurvey = data?.createSurvey.survey;
      const cachedListing = cache.readQuery<{ listing: Listing }>({
        query: LISTING_WITH_RESPONDERS,
        variables: { id: parseInt(listing.id) },
      });
      if (newSurvey && cachedListing) {
        cache.writeQuery({
          query: LISTING_WITH_RESPONDERS,
          variables: { id: parseInt(listing.id) },
          data: {
            listing: {
              survey: newSurvey,
            },
          },
        });
      }
    },
    // upon creating the survey, show it
    onCompleted: () => {
      showSurvey(true);
    },
  });

  // if the listing has no survey, shows create button; otherwise, shows button to show the survey
  return (
    <>
      <Typography variant="h3">{listing.title}</Typography>
      <Typography>{listing.description}</Typography>
      {listing.survey ? (
        <Button
          variant="contained"
          color="primary"
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
