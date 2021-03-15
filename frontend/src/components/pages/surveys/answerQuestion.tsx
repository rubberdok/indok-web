import { Answer } from "@interfaces/surveys";
import {
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  Radio,
  Checkbox,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
} from "@material-ui/core";

const AnswerQuestion: React.FC<{
  answer: Answer;
  setAnswer: (answer: Answer) => void;
}> = ({ answer, setAnswer }) => {
  return (
    // TODO: Implement checkboxes & drop-down
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
      ) : (
        // TODO: change implementation of question types to avoid failsafes like this
        <p>Error in question</p>
      )}
    </FormControl>
  );
};

export default AnswerQuestion;
