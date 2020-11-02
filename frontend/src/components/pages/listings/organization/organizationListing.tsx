import { Listing } from "@interfaces/listings";
import { Survey } from "@interfaces/surveys";
import { CREATE_SURVEY } from "@graphql/surveys/mutations";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import CreateSurvey from "@components/pages/surveys/createSurvey";

const OrganizationListing: React.FC<{ listing: Listing }> = ({ listing }) => {
    const [surveyShown, showSurvey] = useState(false);
    const [createSurvey, { data }] = useMutation<{ createSurvey: { survey: Survey } }>(CREATE_SURVEY);
    return (
        <>
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <button
                onClick={e => {
                    e.preventDefault();
                    if(!listing.survey){
                        createSurvey({ variables: {
                            descriptiveName: `Søknad: ${listing.title}`,
                            description: "",
                        }});
                        listing.survey = data!.createSurvey.survey;
                    }
                    showSurvey(!surveyShown);
                }}
            >
                {surveyShown ? "Vis søknad" : "Gjem søknad"}
            </button>
            {surveyShown && listing.survey &&
                <CreateSurvey oldSurvey={listing.survey} />
            }
        </>
    );
}

export default OrganizationListing;