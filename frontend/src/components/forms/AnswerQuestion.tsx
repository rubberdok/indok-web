import { FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@material-ui/core";
import AnswerCheckboxes from "@components/forms/AnswerCheckboxes";
import { AnswerState } from "@components/forms/AnswerForm";

/**
 * component to answer a question on a form
 *
 * props:
 * - the answer state, passed down from answerForm
 * - setAnswer function to change answer state
 */
const AnswerQuestion: React.FC<{
  answer: AnswerState;
  setAnswer: (answer: AnswerState) => void;
}> = ({ answer, setAnswer }) => {
  // returns a form input based on the type of the answer's question
  // each input calls on setAnswer to change the state of AnswerForm
  switch (answer.question.questionType) {
    case "PARAGRAPH":
      return (
        <TextField
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={answer.answer}
          onChange={(e) => {
            setAnswer({ ...answer, answer: e.target.value });
          }}
        />
      );
    case "SHORT_ANSWER":
      return (
        <TextField
          variant="outlined"
          fullWidth
          value={answer.answer}
          onChange={(e) => {
            setAnswer({ ...answer, answer: e.target.value });
          }}
        />
      );
    case "MULTIPLE_CHOICE":
      return (
        <RadioGroup
          value={answer.answer}
          onChange={(e) => {
            setAnswer({ ...answer, answer: e.target.value });
          }}
        >
          {(answer.question.options ?? []).map((option, index) => (
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
      return <AnswerCheckboxes answer={answer} setAnswer={setAnswer} />;
    case "DROPDOWN":
      return (
        <Select
          fullWidth
          value={answer.answer}
          onChange={(e) => {
            // ugly typecasting, but necessary with Material UI's Select component
            setAnswer({ ...answer, answer: e.target.value as string });
          }}
        >
          {(answer.question.options ?? []).map((option, index) => (
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
