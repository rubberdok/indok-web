import { Question } from "@interfaces/surveys";
import TextField from "@components/pages/surveys/formComponents/textfield";
import Choice from "@components/pages/surveys/formComponents/choice";

const QuestionDetail: React.FC<{
  question: Question;
  active: boolean;
  key?: string;
}> = ({ question, active, key }) => {
  switch (question.questionType.name) {
    case "Textfield":
      return <TextField title={question.question} size="short" key={key} />;
    case "Choice":
      return (
        <Choice
          title={question.question}
          radio={true}
          options={question.offeredAnswers.map((offeredAnswer) => offeredAnswer.answer)}
          key={key}
        />
      );
    default:
      return <TextField title={question.question} key={key} />;
  }
};

export default QuestionDetail;
