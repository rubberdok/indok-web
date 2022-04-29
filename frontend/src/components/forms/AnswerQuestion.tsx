import { FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import AnswerCheckboxes from "@components/forms/AnswerCheckboxes";
import { Question } from "@interfaces/forms";

type Props = {
  question: Question;
  answer: string;
  onValueChanged: (value: string) => void;
};
/**
 * Component to answer a question on a form.
 *
 * Props:
 * - the answer state, passed down from answerForm
 * - onValueChanged function to change answer state
 */
const AnswerQuestion: React.FC<Props> = ({ answer, question, onValueChanged }) => {
  // returns a form input based on the type of the answer's question
  // each input calls on onValueChanged to change the state of AnswerForm
  switch (question.questionType) {
    case "PARAGRAPH":
      return (
        <TextField
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={answer}
          onChange={(e) => onValueChanged(e.target.value)}
        />
      );
    case "SHORT_ANSWER":
      return <TextField variant="outlined" fullWidth value={answer} onChange={(e) => onValueChanged(e.target.value)} />;
    case "MULTIPLE_CHOICE":
      return (
        <RadioGroup value={answer} onChange={(e) => onValueChanged(e.target.value)}>
          {(question.options ?? []).map((option, index) => (
            <FormControlLabel
              key={index}
              value={option.answer}
              label={option.answer}
              control={<Radio color="primary" />}
            />
          ))}
        </RadioGroup>
      );
    case "CHECKBOXES":
      return <AnswerCheckboxes answer={answer} question={question} onValueChanged={onValueChanged} />;
    case "DROPDOWN":
      return (
        <Select fullWidth value={answer} onChange={(e) => onValueChanged(e.target.value as string)}>
          {(question.options ?? []).map((option, index) => (
            <MenuItem key={index} value={option.answer}>
              {option.answer}
            </MenuItem>
          ))}
        </Select>
      );
    case "SLIDER":
      return <p>To be implemented</p>;
    case "FILE_UPLOAD":
      return <p>To be implemented</p>;
  }
};

export default AnswerQuestion;
