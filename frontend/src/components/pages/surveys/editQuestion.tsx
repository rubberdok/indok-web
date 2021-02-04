import { Question, QuestionType } from "@interfaces/surveys";
import { UPDATE_QUESTION } from "@graphql/surveys/mutations";
import { useMutation } from "@apollo/client";
import TextField from "@components/pages/surveys/formComponents/textfield";
import Dropdown from "@components/pages/surveys/formComponents/dropdown";
import Choice from "@components/pages/surveys/formComponents/choice";

const EditQuestion: React.FC<{
  question: Question;
  questionTypes: QuestionType[];
  setQuestion: (question: Question) => void;
  setActiveQuestion: (question: Question) => void;
}> = ({ question, setQuestion, questionTypes }) => {
  const [updateQuestion] = useMutation(UPDATE_QUESTION);
  const questionComponent = (questionType: QuestionType) => {
    switch (question.questionType.name) {
      case "Textfield":
        return <TextField title={question.question} size="short" />;
      case "Choice":
        return (
          <Choice
            title={question.question}
            radio={true}
            options={question.offeredAnswers.map((offeredAnswer) => offeredAnswer.answer)}
          />
        );
      default:
        return <TextField title={question.question} key={key} />;
    }
  };
  return (
    <>
      <TextField
        title="Spørsmål:"
        value={question.question}
        onChange={(e) => {
          e.preventDefault();
          setQuestion({
            ...question,
            question: e.target.value,
          });
        }}
      />
      <Dropdown
        title="Type"
        options={questionTypes.map((type) => type.name)}
        onChange={(e) => {
          question.questionType = questionTypes.find((type) => type.name === e.target.value) ?? questionTypes[0];
        }}
      />
      {}
    </>
  );
};

export default EditQuestion;
