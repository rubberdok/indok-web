import { Question } from "@interfaces/surveys";

const QuestionDetail: React.FC<{
  question: Question;
  setActive: () => void;
}> = ({ question, setActive }) => {
  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setActive();
        }}
      >
        Rediger spørsmål
      </button>
      <br />
      <p>{question.question}</p>
    </>
  );
};

export default QuestionDetail;
