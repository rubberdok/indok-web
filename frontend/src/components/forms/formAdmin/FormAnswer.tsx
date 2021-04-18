import { Answer, Question } from "@interfaces/forms";
import { Typography, Grid, makeStyles } from "@material-ui/core";
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
 * component to show an answer to a question on a form
 *
 * props:
 * - the question on the form
 * - the responder's answer
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
            <QuestionTypePreview question={question} value={answer.answer} />
          ) : question.questionType === "CHECKBOXES" ? (
            <QuestionTypePreview question={question} values={answer.answer.split("|||")} />
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
