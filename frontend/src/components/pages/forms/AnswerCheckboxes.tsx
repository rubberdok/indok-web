import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { Option, Question } from "@interfaces/forms";

/**
 * Component to answer questions of the Checkboxes type.
 * Separated into its own component, since multiple possible answers requires its own logic.
 *
 * Props:
 * - the answer state, passed down from answerForm
 * - onValueChanged function to change answer state
 */
const AnswerCheckboxes: React.FC<{
  answer: string;
  question: Question;
  onValueChanged: (value: string) => void;
}> = ({ answer, question, onValueChanged }) => {
  // state to manage which options are selected
  const [selectedOptions, selectOptions] = useState<Option[]>(
    question.options ? question.options?.filter((option) => answer.split("|||").includes(option.answer)) : []
  );

  // every time options changes, set answer to the concatenation of selected options
  useEffect(() => {
    onValueChanged(selectedOptions.map((option) => option.answer).join("|||"));
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
