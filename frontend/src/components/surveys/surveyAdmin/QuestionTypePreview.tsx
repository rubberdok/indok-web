import { Question } from "@interfaces/surveys";
import { Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup, TextField } from "@material-ui/core";

/**
 * component to show a preview of how a survey question's input will look like to the end user
 * props: the question with questionType to preview
 */
const QuestionTypePreview: React.FC<{
  question: Question;
}> = ({ question }) => {
  switch (question.questionType) {
    case "PARAGRAPH":
      return <TextField disabled label="Langsvar" variant="outlined" multiline rows={4} />;
    case "SHORT_ANSWER":
      return <TextField disabled label="Kortsvar" variant="outlined" />;
    case "MULTIPLE_CHOICE":
      return (
        <RadioGroup>
          {question.options.map((option, index) => (
            <FormControlLabel value={null} key={index} label={option.answer} control={<Radio disabled />} />
          ))}
        </RadioGroup>
      );
    case "CHECKBOXES":
      return (
        <FormGroup>
          {question.options.map((option, index) => (
            <FormControlLabel key={index} label={option.answer} control={<Checkbox disabled />} />
          ))}
        </FormGroup>
      );
    case "DROPDOWN":
      return (
        <ol>
          {question.options.map((option, index) => (
            <li key={index}>{option.answer}</li>
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
