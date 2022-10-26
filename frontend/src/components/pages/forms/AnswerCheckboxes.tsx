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
export const AnswerCheckboxes: React.FC<React.PropsWithChildren<Props>> = ({ answer, question, onAnswerChange }) => {
  // state to manage which options are selected
  const [selectedOptions, setSelectedOptions] = useState<OptionFragment[]>(
    question.options ? question.options?.filter((option) => answer.split("|||").includes(option.answer)) : []
  );

  /*
    Every time options changes, sets answer to the concatenation of selected options.
    
    Why concatenate?
    Checkboxes is the only question type that allows multiple answers.
    Rather than change the backend model to allow multiple answers to a question,
    we concatenate the answers to preservethe single-answer model.
    This should not cause problems when choosing a rarely-typed concatenation separator,
    and not allowing that separator as part of an Option.
  */
  useEffect(() => {
    onAnswerChange(selectedOptions.map((option) => option.answer).join("|||"));
  }, [selectedOptions]);

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
                    setSelectedOptions([...selectedOptions, option]);
                  }
                } else {
                  if (selectedOptions.includes(option)) {
                    setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption !== option));
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
