import { FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";

import { AnswerCheckboxes } from "@/components/pages/forms/AnswerCheckboxes";
import { QuestionFragment, QuestionTypeEnum } from "@/generated/graphql";

type Props = {
  question: QuestionFragment;
  /** Answer state passed down from AnswerForm */
  answer: string;
  onAnswerChange: (value: string) => void;
};

/** Component to answer a question on a form. */
export const AnswerQuestion: React.FC<React.PropsWithChildren<Props>> = ({ answer, question, onAnswerChange }) => {
  // returns a form input based on the type of the answer's question
  // each input calls on onValueChanged to change the state of AnswerForm
  switch (question.questionType) {
    case QuestionTypeEnum.Paragraph:
      return <TextField fullWidth multiline rows={4} value={answer} onChange={(e) => onAnswerChange(e.target.value)} />;
    case QuestionTypeEnum.ShortAnswer:
      return <TextField fullWidth value={answer} onChange={(e) => onAnswerChange(e.target.value)} />;
    case QuestionTypeEnum.MultipleChoice:
      return (
        <RadioGroup value={answer} onChange={(e) => onAnswerChange(e.target.value)}>
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
    case QuestionTypeEnum.Checkboxes:
      return <AnswerCheckboxes answer={answer} question={question} onAnswerChange={onAnswerChange} />;
    case QuestionTypeEnum.Dropdown:
      return (
        <Select fullWidth value={answer} onChange={(e) => onAnswerChange(e.target.value as string)}>
          {(question.options ?? []).map((option, index) => (
            <MenuItem key={index} value={option.answer}>
              {option.answer}
            </MenuItem>
          ))}
        </Select>
      );
    case QuestionTypeEnum.Slider:
      return <p>To be implemented</p>;
    case QuestionTypeEnum.FileUpload:
      return <p>To be implemented</p>;
  }

  return null;
};
