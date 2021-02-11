import { Question } from "@interfaces/surveys";
import QuestionPreview from "@components/pages/surveys/questionPreview";

const QuestionDetail: React.FC<{
  question: Question;
  setActive: () => void;
}> = ({ question, setActive }) => {
  return (
    <>
      {question.question}
      <QuestionPreview question={question} />
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

export default QuestionDetail;
