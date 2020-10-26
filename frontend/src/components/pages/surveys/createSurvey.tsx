import { Listing } from "@interfaces/listings";
import { useQuery, useMutation } from "@apollo/client";
import { QUESTIONTYPES } from "@graphql/surveys/queries";
import { CREATE_SURVEY, CREATE_QUESTION } from "@graphql/surveys/mutations";
import { useState } from "react";
import TextField from "@components/pages/surveys/textfield";

const CreateSurvey: React.FC<{ listing: Listing }> = ({ listing }) => {
    const { loading, error, data } = useQuery<{ questionTypes: QuestionType[] }>(QUESTIONTYPES);
    const [survey, setSurvey] = useState<Survey>({} as Survey);
    const [createSurvey] = useMutation(CREATE_SURVEY);
    //temporary implementation until bulk mutation for createSurvey is implemented
    const [createQuestion] = useMutation(CREATE_QUESTION);
    return (
        <>
            <form>
                <TextField title="Spørsmålstekst:" />
                <button type="submit">Legg til spørsmål</button>
            </form>
            <form>
                <button type="submit">Lag søknad</button>
            </form>
        </>
    );
};
