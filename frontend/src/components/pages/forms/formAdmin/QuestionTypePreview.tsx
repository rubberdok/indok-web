import { Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup, TextField, Box } from "@mui/material";

import questionTypeLabels from "@/components/pages/forms/formAdmin/questionTypeLabels";
import { QuestionTypeEnum, QuestionWithAnswerIdsFragment } from "@/generated/graphql";
import { Question } from "@/interfaces/forms";

type Props = {
  question: QuestionWithAnswerIdsFragment;
  /** Optional answer for showing selected answer in questions with options */
  answer?: string;
  /** Optional answers for showing selected answers in checkbox questions */
  answers?: string[];
};

/** Component to show a preview of how a form question's input will look like to the end user. */
const QuestionTypePreview: React.FC<Props> = ({ question, answer, answers }) => {
  switch (question.questionType) {
    case QuestionTypeEnum.Paragraph:
      return <TextField fullWidth disabled label={questionTypeLabels[question.questionType]} multiline rows={4} />;
    case QuestionTypeEnum.ShortAnswer:
      return <TextField fullWidth disabled label={questionTypeLabels[question.questionType]} />;
    case QuestionTypeEnum.MultipleChoice:
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
    case QuestionTypeEnum.Checkboxes:
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
    case QuestionTypeEnum.Dropdown:
      return (
        <ol>
          {(question.options ?? []).map((option, index) => (
            <li key={index}>
              <Box fontWeight={answer === option.answer ? "bold" : undefined}>{option.answer}</Box>
            </li>
          ))}
        </ol>
      );
    case QuestionTypeEnum.Slider:
      return <p>To be implemented</p>;
    case QuestionTypeEnum.FileUpload:
      return <p>To be implemented</p>;
    default:
      return <></>;
  }
};

export default QuestionTypePreview;
