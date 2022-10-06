import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useEffect, useState } from "react";

import { OptionFragment, QuestionFragment } from "@/generated/graphql";

type Props = {
  question: QuestionFragment;
  /** Answer state passed down from AnswerForm */
  answer: string;
  onAnswerChange: (value: string) => void;
};

/**
 * Component to answer questions of the Checkboxes type.
 * Separated into its own component, since multiple possible answers requires its own logic.
 */
const AnswerCheckboxes: React.FC<Props> = ({ answer, question, onAnswerChange }) => {
  // state to manage which options are selected
  const [selectedOptions, selectOptions] = useState<OptionFragment[]>(
    question.options ? question.options?.filter((option) => answer.split("|||").includes(option.answer)) : []
  );

  // every time options changes, set answer to the concatenation of selected options
  useEffect(() => {
    onAnswerChange(selectedOptions.map((option) => option.answer).join("|||"));
  }, [selectedOptions]);
  /*
    Why concatenate?
    Checkboxes is the only question type that allows multiple answers.
    Rather than change the backend model to allow multiple answers to a question, we concatenate the answers to preserve the single-answer model.
    This should not cause problems when choosing a rarely-typed concatenation separator, and not allowing that separator as part of an Option.
  */

  return (
    <FormGroup>
      {(question.options ?? []).map((option) => (
        <FormControlLabel
          key={option.id}
          label={option.answer}
          control={
            <Checkbox
              checked={selectedOptions.includes(option)}
              color="primary"
              onChange={(e) => {
                if (e.target.checked) {
                  if (!selectedOptions.includes(option)) {
                    selectOptions([...selectedOptions, option]);
                  }
                } else {
                  if (selectedOptions.includes(option)) {
                    selectOptions(selectedOptions.filter((selectedOption) => selectedOption !== option));
                  }
                }
              }}
            />
          }
        />
      ))}
    </FormGroup>
  );
};

export default AnswerCheckboxes;
