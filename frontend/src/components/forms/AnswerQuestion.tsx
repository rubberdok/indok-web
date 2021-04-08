import { Answer } from "@interfaces/forms";
import { FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@material-ui/core";
import AnswerCheckboxes from "@components/forms/AnswerCheckboxes";

/**
 * component to answer a question on a form
 * props: the answer/setAnswer state, which alters the state of the higher component
 */
const AnswerQuestion: React.FC<{
  answer: Answer;
  setAnswer: (answer: Answer) => void;
}> = ({ answer, setAnswer }) => {
  // returns a form input based on the type of the answer's question
  // each input calls on setAnswer to change the state of AnswerForm
  switch (answer.question.questionType) {
    case "PARAGRAPH":
      return (
        <TextField
          variant="outlined"
          multiline
          rows={4}
          onChange={(e) => {
            e.preventDefault();
            setAnswer({ ...answer, answer: e.target.value });
          }}
        />
      );
    case "SHORT_ANSWER":
      return (
        <TextField
          variant="outlined"
          onChange={(e) => {
            e.preventDefault();
            setAnswer({ ...answer, answer: e.target.value });
          }}
        />
      );
    case "MULTIPLE_CHOICE":
      return (
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
      );
    case "CHECKBOXES":
      return <AnswerCheckboxes answer={answer} setAnswer={setAnswer} />;
    case "DROPDOWN":
      return (
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
      );
    case "SLIDER":
      return <p>To be implemented</p>;
    case "FILE_UPLOAD":
      return <p>To be implemented</p>;
  }
};

export default AnswerQuestion;
