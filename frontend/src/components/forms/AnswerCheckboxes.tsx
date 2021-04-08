import { Answer, Option } from "@interfaces/forms";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { useEffect, useState } from "react";

/**
 * component to answer questions of the Checkboxes type
 * separated into its own component, since multiple possible answers requires its own logic
 * props: the answer/setAnswer state, passed down from answerForm
 */
const AnswerCheckboxes: React.FC<{
  answer: Answer;
  setAnswer: (answer: Answer) => void;
}> = ({ answer, setAnswer }) => {
  //state to manage which options are selected
  const [selectedOptions, selectOptions] = useState<Option[]>([]);

  // every time selectedOptions changes, set answer to the concatenation of selected options
  useEffect(() => {
    setAnswer({ ...answer, answer: selectedOptions.map((option) => option.answer).join("||") });
  }, [selectedOptions]);
  /*
    Why concatenate?
    Checkboxes is the only question type that allows multiple answers.
    Rather than change the backend model to allow multiple answers to a question, we concatenate the answers to preserve the single-answer model.
    This should not cause problems when choosing a rarely-typed concatenation separator, and not allowing that separator as part of an Option.
    This can all be handled front-end.
  */

  return (
    <>
      {answer.question.options.map((option, index) => (
        <FormControlLabel
          key={index}
          value={option.answer}
          label={option.answer}
          control={
            <Checkbox
              onChange={(e) => {
                e.preventDefault();
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
    </>
  );
};

export default AnswerCheckboxes;
