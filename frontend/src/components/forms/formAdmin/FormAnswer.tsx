import { Answer, Question } from "@interfaces/forms";
import { Typography, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import QuestionTypePreview from "./QuestionTypePreview";

const useStyles = makeStyles(() => ({
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
}));

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
  const classes = useStyles();
  return (
    <>
      <Grid container direction="row" spacing={1}>
        <Grid item>
          <Typography className={classes.bold}>{question.question}</Typography>
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
        <Typography className={classes.italic}>Søker svarte ikke på spørsmålet.</Typography>
      )}
    </>
  );
};

export default FormAnswer;
