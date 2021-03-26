import QuestionTypePreview from "@components/pages/surveys/surveyAdmin/QuestionTypePreview";
import { Question } from "@interfaces/surveys";
import { Button, Grid } from "@material-ui/core";

// component to preview a question in a survey when not in editing mode
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
