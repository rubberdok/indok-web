import { Listing } from "@interfaces/listings";
import { useQuery, useMutation } from "@apollo/client";
import { QUESTIONTYPES } from "@graphql/surveys/queries";
import { CREATE_SURVEY, UPDATE_SURVEY, CREATE_QUESTION } from "@graphql/surveys/mutations";
import { useState } from "react";
import TextField from "@components/pages/surveys/formComponents/textfield";
import Dropdown from "@components/pages/surveys/formComponents/dropdown";
import { Survey, QuestionType, Question } from "@interfaces/surveys";
import QuestionDetail from "@components/pages/surveys/questionDetail";
import CreateQuestion from "@components/pages/surveys/createQuestion";

interface EditableQuestion extends Question {
    editing: boolean;
}

interface EditableSurvey extends Survey {
    questions: EditableQuestion[];
}

const CreateSurvey: React.FC<{ listing?: Listing }> = ({ listing }) => {
    const [survey, setSurvey] = useState<EditableSurvey>({} as EditableSurvey);
    const setQuestion = (newQuestion: Question) => {
        setSurvey({
            ...survey,
            questions: survey.questions.map(oldQuestion => (
                oldQuestion.id === newQuestion.id ? { ...newQuestion, editing: true } : oldQuestion
            ))
        });
    }
    if (listing) {
        setSurvey({ ...survey, descriptiveName: listing.title, listing: listing });
    } else {
        setSurvey({ ...survey, descriptiveName: "Ny søknad" });
    }
    const { loading, error, data } = useQuery<{ questionTypes: QuestionType[] }>(QUESTIONTYPES);
    const [createSurvey] = useMutation(CREATE_SURVEY);
    const [updateSurvey] = useMutation(UPDATE_SURVEY);
    const [createQuestion] = useMutation(CREATE_QUESTION);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    createSurvey({ variables: {  }})
    return (
        <>
            {data && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createSurvey();
                    }}
                >
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            createQuestion({variables: {
                                question: "",
                                description: "",
                            }});
                            setSurvey({
                                ...survey,
                                questions: [...survey.questions, { editing: true } as EditableQuestion],
                            });
                        }}
                    >
                        Nytt spørsmål
                    </button>
                    {survey.questions.map((question) => {
                        question.editing ? (
                            <CreateQuestion
                                question={question}
                                setQuestion={setQuestion}
                                questionTypes={data.questionTypes}
                            />
                        ) : (
                            <QuestionDetail question={question as Question} active={false} />
                        );
                    })}
                    <button type="submit">Lag søknad</button>
                </form>
            )}
        </>
    );
};

export default CreateSurvey;
