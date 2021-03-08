import { Question } from "@interfaces/surveys";
import QuestionTypePreview from "@components/pages/surveys/surveyAdmin/questionTypePreview";
import { Button, Grid } from "@material-ui/core";

const QuestionPreview: React.FC<{
  question: Question;
  setActive: () => void;
}> = ({ question, setActive }) => {
  return (
    <Grid>
      <Grid container direction="row" justify="space-between">
        {question.question}
        <Button
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
};

export default QuestionPreview;
