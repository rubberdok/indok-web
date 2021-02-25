import { Answer } from "@interfaces/surveys";
import TextField from "@components/ui/formComponents/textfield";
import Choice from "@components/ui/formComponents/choice";
import Dropdown from "@components/ui/formComponents/dropdown";

const QuestionAnswer: React.FC<{
  answer: Answer;
  setAnswer: (answer: Answer) => void;
}> = ({ answer, setAnswer }) => {
  return (
    <>
      {answer.question.questionType.name === "Short answer" ? (
        <TextField
          title={answer.question.question}
          size="short"
          onChange={(e) => {
            e.preventDefault();
            setAnswer({ ...answer, answer: e.target.value });
          }}
        />
      ) : answer.question.questionType.name === "Paragraph" ? (
        <TextField
          title={answer.question.question}
          size="long"
          onChange={(e) => {
            e.preventDefault();
            setAnswer({ ...answer, answer: e.target.value });
          }}
        />
      ) : answer.question.questionType.name === "Multiple choice" ? (
        <Choice
          title={answer.question.question}
          options={answer.question.offeredAnswers.map((offeredAnswer) => offeredAnswer.answer)}
          name={answer.question.id}
          radio={true}
        />
      ) : answer.question.questionType.name === "Checkboxes" ? (
        <Choice
          title={answer.question.question}
          options={answer.question.offeredAnswers.map((offeredAnswer) => offeredAnswer.answer)}
          name={answer.question.id}
          radio={false}
        />
      ) : answer.question.questionType.name === "Drop-down" ? (
        <Dropdown
          title={answer.question.question}
          options={answer.question.offeredAnswers.map((offeredAnswer) => ({
            text: offeredAnswer.answer,
            value: offeredAnswer.answer,
          }))}
        />
      ) : (
        // TODO: change implementation of question types to avoid failsafes like this
        <p>Error in question</p>
      )}
    </>
  );
};

export default QuestionAnswer;
