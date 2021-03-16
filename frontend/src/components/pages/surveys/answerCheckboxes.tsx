import { Answer, Option } from "@interfaces/surveys";
import { useState } from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";

// component to answer questions of the Checkboxes type
// separated into its own component, since multiple possible answers requires its own logic
// props: the answer/setAnswer state, passed down from answerSurvey
const AnswerCheckboxes: React.FC<{
  answer: Answer;
  setAnswer: (answer: Answer) => void;
}> = ({ answer, setAnswer }) => {
  //state to manage which options are selected
  const [selectedOptions, selectOptions] = useState<Option[]>();

  // TODO: setAnswer to the concatenation of checked options
  /*
    Why concatenate?
    Checkboxes is the only question type that allows multiple answers.
    Rather than change the backend model to allow multiple answers to a question, we concatenate the answers to preserve the single-answer model.
    This should not cause problems when choosing a rarely-typed concatenation separator, and not allowing that separator as part of an Option.
    This can all be handled in the front-end.
  */

  return (
    <>
      {answer.question.options.map((option, index) => (
        <FormControlLabel key={index} value={option.answer} label={option.answer} control={<Checkbox />} />
      ))}
    </>
  );
};

export default AnswerCheckboxes;
