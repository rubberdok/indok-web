import { Question } from "@interfaces/surveys";
import TextField from "@components/ui/formComponents/textfield";
import Dropdown from "@components/ui/formComponents/dropdown";
import Choice from "@components/ui/formComponents/choice";

const QuestionTypePreview: React.FC<{
  question: Question;
}> = ({ question }) => {
  switch (question.questionType.name) {
    case "Short answer":
      return <TextField size="short" disabled value="Kortsvar" />;
    case "Paragraph":
      return <TextField size="long" disabled value="Langsvar" />;
    case "Multiple choice":
      return (
        <Choice
          options={question.offeredAnswers.map((offeredAnswer) => offeredAnswer.answer)}
          name={question.id}
          title={question.question}
          radio={true}
          disabled
        />
      );
    case "Checkboxes":
      return (
        <Choice
          options={question.offeredAnswers.map((offeredAnswer) => offeredAnswer.answer)}
          name={question.id}
          title={question.question}
          radio={true}
          disabled
        />
      );
    default:
      return <TextField title={question.question} disabled />;
  }
};

export default QuestionTypePreview;
