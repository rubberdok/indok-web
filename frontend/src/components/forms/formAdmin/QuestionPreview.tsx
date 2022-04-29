import QuestionTypePreview from "@components/forms/formAdmin/QuestionTypePreview";
import { Question } from "@interfaces/forms";
import { Button, Grid, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";

/**
 * Component to preview a question in a form when not in editing mode.
 *
 * Props:
 * - the question to preview
 * - setActive function to activate editing mode on this question
 */
const QuestionPreview: React.FC<{
  question: Question;
  setActive: () => void;
}> = ({ question, setActive }) => (
  <Grid container direction="column" spacing={1}>
    <Grid item container direction="row" justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography>
          {question.question}
          {question.mandatory && " *"}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setActive();
          }}
          startIcon={<Edit />}
        >
          Rediger
        </Button>
      </Grid>
    </Grid>
    <Grid item>
      <QuestionTypePreview question={question} />
    </Grid>
  </Grid>
);

export default QuestionPreview;
