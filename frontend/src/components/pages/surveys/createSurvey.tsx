import { Listing } from "@interfaces/listings";
import { useQuery, useMutation } from "@apollo/client";
import { QUESTIONTYPES } from "@graphql/surveys/queries";
import { CREATE_SURVEY, CREATE_QUESTION } from "@graphql/surveys/mutations";
import { useState } from "react";
import TextField from "@components/pages/surveys/textfield";
import Dropdown from "@components/pages/surveys/dropdown";
import { Survey, QuestionType, SurveyQuestion } from "@interfaces/surveys";

const CreateSurvey: React.FC<{ listing: Listing }> = ({ listing }) => {
    interface EditableSurveyQuestion extends SurveyQuestion {
        editing: boolean;
    }
    interface EditableSurvey extends Survey {
        surveyQuestions: EditableSurveyQuestion[];
    }
    const [survey, setSurvey] = useState<EditableSurvey>({} as EditableSurvey);
    const { loading, error, data } = useQuery<{ questionTypes: QuestionType[] }>(QUESTIONTYPES);
    const [createSurvey] = useMutation(CREATE_SURVEY);
    //temporary implementation until bulk mutation for createSurvey is implemented
    const [createQuestion] = useMutation(CREATE_QUESTION);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    return (
        <>
            {data &&
                <form>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setSurvey({ ...survey, surveyQuestions: [...survey.surveyQuestions, { editing: true } as EditableSurveyQuestion] })
                    }}>Nytt spørsmål</button>
                    {survey.surveyQuestions.map(question => {
                        question.editing ?
                            <CreateQuestion question={question as SurveyQuestion} />
                        :
                            <Question question={question as SurveyQuestion} />
                    })}
                    <button type="submit">Lag søknad</button>
                </form>
            }
        </>
    );
};
