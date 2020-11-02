import { useQuery, useMutation } from "@apollo/client";
import { QUESTIONTYPES } from "@graphql/surveys/queries";
import { CREATE_SURVEY, UPDATE_SURVEY, CREATE_QUESTION } from "@graphql/surveys/mutations";
import { useState } from "react";
import { Survey, QuestionType, Question } from "@interfaces/surveys";
import QuestionDetail from "@components/pages/surveys/questionDetail";
import CreateQuestion from "@components/pages/surveys/createQuestion";

interface EditableQuestion extends Question {
    editing: boolean;
}

interface EditableSurvey extends Survey {
    questions: EditableQuestion[];
}

const CreateSurvey: React.FC<{ oldSurvey: Survey }> = ({ oldSurvey }) => {
    const [survey, setSurvey] = useState<EditableSurvey>(oldSurvey as EditableSurvey);
    const setQuestion = (newQuestion: Question) => {
        setSurvey({
            ...survey,
            questions: survey.questions.map(oldQuestion => (
                oldQuestion.id === newQuestion.id ? { ...newQuestion, editing: true } : oldQuestion
            ))
        });
    }
    const { loading, error, data } = useQuery<{ questionTypes: QuestionType[] }>(QUESTIONTYPES);
    const [createSurvey] = useMutation(CREATE_SURVEY);
    const [updateSurvey] = useMutation(UPDATE_SURVEY);
    const [createQuestion, { data: questionData }] = useMutation<{ createQuestion: { question: Question } }>(CREATE_QUESTION);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    return (
        <>
            <h4>{survey.descriptiveName}</h4>
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
                            questions: [
                                ...survey.questions,
                                { ...questionData!.createQuestion.question, editing: true }
                            ],
                        });
                    }}
                >
                    Nytt spørsmål
                </button>
                {data && <>
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
                </>}
                <button type="submit">Lag søknad</button>
            </form>
        </>
    );
};

export default CreateSurvey;
