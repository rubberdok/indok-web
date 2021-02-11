import { Question } from "@interfaces/surveys";
import QuestionTypePreview from "@components/pages/surveys/surveyCreation/questionTypePreview";

const QuestionPreview: React.FC<{
  question: Question;
  setActive: () => void;
}> = ({ question, setActive }) => {
  return (
    <>
      {question.question}
      <QuestionTypePreview question={question} />
      <br />
      <button
        onClick={(e) => {
          e.preventDefault();
          setActive();
        }}
      >
        Rediger spørsmål
      </button>
    </>
  );
};

export default QuestionPreview;
