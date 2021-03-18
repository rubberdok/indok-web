import { Question } from "@interfaces/surveys";
import { RadioGroup, Radio, TextField, FormControlLabel, FormGroup, Checkbox } from "@material-ui/core";

// component to show a preview of how a survey question's input will look like to the end user, albeit disabled
const QuestionTypePreview: React.FC<{
  question: Question;
}> = ({ question }) => {
  switch (question.questionType) {
    case "Paragraph":
      return <TextField disabled label="Langsvar" variant="outlined" multiline rows={4} />;
    case "Short answer":
      return <TextField disabled label="Kortsvar" variant="outlined" />;
    case "Multiple choice":
      return (
        <RadioGroup>
          {question.options.map((option, index) => (
            <FormControlLabel key={index} label={option.answer} control={<Radio disabled />} />
          ))}
        </RadioGroup>
      );
    case "Checkboxes":
      return (
        <FormGroup>
          {question.options.map((option, index) => (
            <FormControlLabel key={index} label={option.answer} control={<Checkbox disabled />} />
          ))}
        </FormGroup>
      );
    case "Drop-down":
      return (
        <ol>
          {question.options.map((option, index) => (
            <li key={index}>{option.answer}</li>
          ))}
        </ol>
      );
    default:
      // TODO: change implementation of question types to avoid failsafes like this
      return <p>Error in question</p>;
  }
};

export default QuestionTypePreview;
