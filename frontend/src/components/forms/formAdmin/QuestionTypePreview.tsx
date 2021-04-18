import { Question } from "@interfaces/forms";
import { Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup, TextField, Box } from "@material-ui/core";
import questionTypeLabels from "@components/forms/formAdmin/questionTypeLabels";

/**
 * component to show a preview of how a form question's input will look like to the end user
 *
 * props: the question with questionType to preview
 */
const QuestionTypePreview: React.FC<{
  question: Question;
  value?: string;
  values?: string[];
}> = ({ question, value, values }) => {
  switch (question.questionType) {
    case "PARAGRAPH":
      return (
        <TextField
          fullWidth
          disabled
          label={questionTypeLabels[question.questionType]}
          variant="outlined"
          multiline
          rows={4}
        />
      );
    case "SHORT_ANSWER":
      return <TextField fullWidth disabled label={questionTypeLabels[question.questionType]} variant="outlined" />;
    case "MULTIPLE_CHOICE":
      return (
        <RadioGroup>
          {(question.options ?? []).map((option, index) => (
            <FormControlLabel
              key={index}
              label={<Box fontWeight={value === option.answer ? "bold" : undefined}>{option.answer}</Box>}
              control={<Radio checked={value === option.answer} disabled />}
            />
          ))}
        </RadioGroup>
      );
    case "CHECKBOXES":
      return (
        <FormGroup>
          {(question.options ?? []).map((option, index) => (
            <FormControlLabel
              key={index}
              label={
                <Box fontWeight={values && values.includes(option.answer) ? "bold" : undefined}>{option.answer}</Box>
              }
              control={<Checkbox checked={values && values.includes(option.answer)} disabled />}
            />
          ))}
        </FormGroup>
      );
    case "DROPDOWN":
      return (
        <ol>
          {(question.options ?? []).map((option, index) => (
            <li key={index}>
              <Box fontWeight={value === option.answer ? "bold" : undefined}>{option.answer}</Box>
            </li>
          ))}
        </ol>
      );
    case "SLIDER":
      return <p>To be implemented</p>;
    case "FILE_UPLOAD":
      return <p>To be implemented</p>;
  }
};

export default QuestionTypePreview;
