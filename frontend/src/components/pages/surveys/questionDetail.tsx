import { Question } from "@interfaces/surveys";

const QuestionDetail: React.FC<{
  question: Question;
  setActiveQuestion: (question: Question) => void;
  key?: string;
}> = ({ question, setActiveQuestion, key }) => {
  return (
    <li>
      <button
        onClick={(e) => {
          e.preventDefault();
          setActiveQuestion(question);
        }}
      >
        Rediger spørsmål
      </button>
      <br />
      <p>{question.question}</p>
    </li>
  );
};

export default QuestionDetail;
