import { Grid, Typography } from "@mui/material";

import { Answer, Question } from "@interfaces/forms";

import QuestionTypePreview from "./QuestionTypePreview";

/**
 * Component to show an answer to a question on a form.
 *
 * Props:
 * - the question on the form
 * - the responder's answer (undefined if responder gave no answer)
 */
const FormAnswer: React.FC<{
  question: Question;
  answer: Answer | undefined;
}> = ({ question, answer }) => {
  return (
    <>
      <Grid container direction="row" spacing={1}>
        <Grid item>
          <Typography sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}>{question.question}</Typography>
        </Grid>
        <Grid item>
          <Typography>{question.mandatory && " *"}</Typography>
        </Grid>
      </Grid>
      {answer?.answer ? (
        <>
          {question.questionType === "MULTIPLE_CHOICE" || question.questionType === "DROPDOWN" ? (
            <QuestionTypePreview question={question} answer={answer.answer} />
          ) : question.questionType === "CHECKBOXES" ? (
            <QuestionTypePreview question={question} answers={answer.answer.split("|||")} />
          ) : (
            <Typography>{answer.answer}</Typography>
          )}
        </>
      ) : (
        <Typography sx={{ fontStyle: "italic" }}>Søker svarte ikke på spørsmålet.</Typography>
      )}
    </>
  );
};

export default FormAnswer;
