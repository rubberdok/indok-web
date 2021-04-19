import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { useEffect, useState } from "react";
import { AnswerState } from "@components/forms/AnswerForm";

/**
 * component to answer questions of the Checkboxes type
 *
 * separated into its own component, since multiple possible answers requires its own logic
 *
 * props:
 * - the answer state, passed down from answerForm
 * - setAnswer function to change answer state
 */
const AnswerCheckboxes: React.FC<{
  answer: AnswerState;
  setAnswer: (answer: AnswerState) => void;
}> = ({ answer, setAnswer }) => {
  // state to manage which options are selected
  const [selectedOptions, selectOptions] = useState<string[]>([]);

  // every time options changes, set answer to the concatenation of selected options
  useEffect(() => {
    setAnswer({
      ...answer,
      answer: selectedOptions.join("|||"),
    });
  }, [selectedOptions]);
  /*
    Why concatenate?
    Checkboxes is the only question type that allows multiple answers.
    Rather than change the backend model to allow multiple answers to a question, we concatenate the answers to preserve the single-answer model.
    This should not cause problems when choosing a rarely-typed concatenation separator, and not allowing that separator as part of an Option.
  */

  return (
    <FormGroup>
      {(answer.question.options ?? []).map((option) => (
        <FormControlLabel
          key={option.id}
          label={option.answer}
          control={
            <Checkbox
              checked={selectedOptions.includes(option.answer)}
              color="primary"
              onChange={(e) => {
                if (e.target.checked) {
                  if (!selectedOptions.includes(option.answer)) {
                    selectOptions([...selectedOptions, option.answer]);
                  }
                } else {
                  if (selectedOptions.includes(option.answer)) {
                    selectOptions(selectedOptions.filter((selectedOption) => selectedOption !== option.answer));
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
