import { Answer } from "@interfaces/surveys";
import {
  TextField,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@material-ui/core";
import AnswerCheckboxes from "./answerCheckboxes";

// component to answer a question on a survey
// props: the answer/setAnswer state, which alters the state of the higher component
const AnswerQuestion: React.FC<{
  answer: Answer;
  setAnswer: (answer: Answer) => void;
}> = ({ answer, setAnswer }) => {
  // returns a form, with input types determined by the question type of each answer's question
  // each input type calls on setAnswer
  return (
    <FormControl>
      <FormLabel>{answer.question.question}</FormLabel>
      {answer.question.questionType.name === "Short answer" ? (
        <TextField
          variant="outlined"
          onChange={(e) => {
            e.preventDefault();
            setAnswer({ ...answer, answer: e.target.value });
          }}
        />
      ) : answer.question.questionType.name === "Paragraph" ? (
        <TextField
          variant="outlined"
          multiline
          rows={4}
          onChange={(e) => {
            e.preventDefault();
            setAnswer({ ...answer, answer: e.target.value });
          }}
        />
      ) : answer.question.questionType.name === "Multiple choice" ? (
        <RadioGroup
          onChange={(e) => {
            e.preventDefault();
            setAnswer({ ...answer, answer: e.target.value });
          }}
        >
          {answer.question.options.map((option, index) => (
            <FormControlLabel key={index} value={option.answer} label={option.answer} control={<Radio />} />
          ))}
        </RadioGroup>
      ) : answer.question.questionType.name === "Checkboxes" ? (
        <AnswerCheckboxes answer={answer} setAnswer={setAnswer} />
      ) : answer.question.questionType.name === "Drop-down" ? (
        <Select
          onChange={(e) => {
            e.preventDefault();
            // ugly typecasting, but necessary with Material UI's Select component
            setAnswer({ ...answer, answer: e.target.value as string });
          }}
        >
          {answer.question.options.map((option, index) => (
            <MenuItem key={index} value={option.answer}>
              {option.answer}
            </MenuItem>
          ))}
        </Select>
      ) : (
        // TODO: change implementation of question types to avoid failsafes like this
        <p>Error in question</p>
      )}
    </FormControl>
  );
};

export default AnswerQuestion;
