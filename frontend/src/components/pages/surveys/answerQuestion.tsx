import { Answer } from "@interfaces/surveys";
import {
  FormControl,
  FormControlLabel,
  FormLabel, MenuItem,
  Radio,
  RadioGroup, Select, TextField
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
      {answer.question.questionType === "PARAGRAPH" ? (
        <TextField
          variant="outlined"
          multiline
          rows={4}
          onChange={(e) => {
            e.preventDefault();
            setAnswer({ ...answer, answer: e.target.value });
          }}
        />
      ) : answer.question.questionType === "SHORT_ANSWER" ? (
        <TextField
          variant="outlined"
          onChange={(e) => {
            e.preventDefault();
            setAnswer({ ...answer, answer: e.target.value });
          }}
        />
      ) : answer.question.questionType === "MULTIPLE_CHOICE" ? (
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
      ) : answer.question.questionType === "CHECKBOXES" ? (
        <AnswerCheckboxes answer={answer} setAnswer={setAnswer} />
      ) : answer.question.questionType === "DROPDOWN" ? (
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
      ) : answer.question.questionType === "SLIDER" ? (
        // TODO: implement slider
        <p>To be implemented</p>
      ) : answer.question.questionType === "FILE_UPLOAD" ? (
        // TODO: implement File upload
        <p>To be implemented</p>
      ) : (
        // TODO: change implementation of question types to avoid failsafes like this
        <p>Error in question</p>
      )}
    </FormControl>
  );
};

export default AnswerQuestion;
