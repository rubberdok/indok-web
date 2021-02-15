import { Question } from "@interfaces/surveys";
import TextField from "@components/ui/formComponents/textfield";

const QuestionAnswer: React.FC<{
  question: Question;
}> = ({ question }) => {
  switch (question.questionType.name) {
    case "Short Answer":
      return (
        <TextField
          size="short"
          onChange={(e) => {
            e.preventDefault();
          }}
        />
      );
    case "Paragraph":
      return (
        <TextField
          size="short"
          onChange={(e) => {
            e.preventDefault();
          }}
        />
      );
    default:
      return <p>Question type error</p>;
  }
};

export default QuestionAnswer;
