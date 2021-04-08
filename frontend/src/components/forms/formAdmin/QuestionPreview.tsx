import QuestionTypePreview from "@components/forms/formAdmin/QuestionTypePreview";
import { Question } from "@interfaces/forms";
import { Button, Grid } from "@material-ui/core";

/**
 * component to preview a question in a form when not in editing mode
 * props:
 * - the question to preview
 * - setActive function to activate editing mode on this question
 */
const QuestionPreview: React.FC<{
  question: Question;
  setActive: () => void;
}> = ({ question, setActive }) => (
  <Grid container direction="column">
    <Grid container direction="row" justify="space-between">
      {question.question}
      <Button
        variant="contained"
        onClick={(e) => {
          e.preventDefault();
          setActive();
        }}
      >
        Rediger spørsmål
      </Button>
    </Grid>
    <QuestionTypePreview question={question} />
  </Grid>
);

export default QuestionPreview;
