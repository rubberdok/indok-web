import { Question, QuestionType } from "@interfaces/surveys";
import { CREATE_QUESTION, UPDATE_QUESTION } from "@graphql/surveys/mutations";
import { useMutation } from "@apollo/client";
import TextField from "@components/pages/surveys/formComponents/textfield";
import Dropdown from "@components/pages/surveys/formComponents/dropdown";

const CreateQuestion: React.FC<{
    question: Question;
    setQuestion: (question: Question) => void,
    questionTypes: QuestionType[];
}> = ({ question, setQuestion, questionTypes }) => {
    const [updateQuestion] = useMutation(UPDATE_QUESTION);
    return (
        <>
            <TextField
                title="Spørsmål:"
                value={question.question}
                onChange={(e) => {
                    e.preventDefault();
                    setQuestion({
                        ...question,
                        question: e.target.value
                    })
                }}
            />
            <Dropdown 
                title="Type" 
                options={questionTypes.map(type => type.name)} 
                onChange={(e) => {
                    question.questionType = questionTypes.find(type => type.name === e.target.value) ?? questionTypes[0]
                }}
            /> 
            // TODO: Implement the remaining question details.
        </>
    );
};

export default CreateQuestion;
