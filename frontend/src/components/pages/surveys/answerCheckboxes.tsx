import { Answer, Option } from "@interfaces/surveys";
import { useState } from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";

const AnswerCheckboxes: React.FC<{
  answer: Answer;
  setAnswer: (answer: Answer) => void;
}> = ({ answer, setAnswer }) => {
  const [selectedOptions, selectOptions] = useState<Option[]>();
  return (
    <>
      {answer.question.options.map((option, index) => (
        <FormControlLabel key={index} value={option.answer} label={option.answer} control={<Checkbox />} />
      ))}
    </>
  );
};

export default AnswerCheckboxes;
