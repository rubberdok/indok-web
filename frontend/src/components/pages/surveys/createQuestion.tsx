import { Question, QuestionType } from "@interfaces/surveys";
import { CREATE_QUESTION, UPDATE_QUESTION } from "@graphql/surveys/mutations";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import TextField from "@components/pages/surveys/formComponents/textfield";
import Dropdown from "@components/pages/surveys/formComponents/dropdown";

const CreateQuestion: React.FC<{
    question: Question;
    questionTypes: QuestionType[];
}> = ({ question, questionTypes }) => {
    const [createQuestion] = useMutation(CREATE_QUESTION);
    const [updateQuestion] = useMutation(UPDATE_QUESTION);
    return (
        <>
            <TextField
                title="Spørsmål:"
                value={question.question}
                onChange={(e) => {
                    question.question = e.target.value;
                }}
            />
        </>
    );
};

export default CreateQuestion;
