import { Question } from "@interfaces/surveys";
import TextField from "@components/pages/surveys/formComponents/textfield";
import Choice from "@components/pages/surveys/formComponents/choice";

const QuestionDetail: React.FC<{ question: Question; active: boolean }> = ({ question, active }) => {
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
      return <TextField title={question.question} />;
  }
};

export default QuestionDetail;
