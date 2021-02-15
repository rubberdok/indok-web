import { Answer } from "@interfaces/surveys";
import TextField from "@components/ui/formComponents/textfield";

const QuestionAnswer: React.FC<{
  answer: Answer;
  setAnswer: (answer: Answer) => void;
}> = ({ answer, setAnswer }) => {
  const questionInput = () => {
    switch (answer.question.questionType.name) {
      case "Short answer":
        return (
          <TextField
            size="short"
            onChange={(e) => {
              e.preventDefault();
              setAnswer({ ...answer, answer: e.target.value });
            }}
          />
        );
      case "Paragraph":
        return (
          <TextField
            size="short"
            onChange={(e) => {
              e.preventDefault();
              setAnswer({ ...answer, answer: e.target.value });
            }}
          />
        );
      default:
        return <p>Question type error</p>;
    }
  };
  return (
    <>
      {answer.question.question}
      {questionInput()}
    </>
  );
};

export default QuestionAnswer;
