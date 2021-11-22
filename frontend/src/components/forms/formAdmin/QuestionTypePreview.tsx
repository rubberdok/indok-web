import { Question } from "@interfaces/forms";
import { Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup, TextField, Box } from "@mui/material";
import questionTypeLabels from "@components/forms/formAdmin/questionTypeLabels";

/**
 * Component to show a preview of how a form question's input will look like to the end user.
 *
 * Props:
 * - the question with questionType to preview
 * - optional answer for showing selected answer in questions with options
 * - optional answers for showing selected answers in checkbox questions
 */
const QuestionTypePreview: React.FC<{
  question: Question;
  answer?: string;
  answers?: string[];
}> = ({ question, answer, answers }) => {
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
              label={<Box fontWeight={answer === option.answer ? "bold" : undefined}>{option.answer}</Box>}
              control={<Radio color="primary" checked={answer === option.answer} disabled />}
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
                <Box fontWeight={answers && answers.includes(option.answer) ? "bold" : undefined}>{option.answer}</Box>
              }
              control={<Checkbox color="primary" checked={answers && answers.includes(option.answer)} disabled />}
            />
          ))}
        </FormGroup>
      );
    case "DROPDOWN":
      return (
        <ol>
          {(question.options ?? []).map((option, index) => (
            <li key={index}>
              <Box fontWeight={answer === option.answer ? "bold" : undefined}>{option.answer}</Box>
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
