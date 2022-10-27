import { Edit } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";

import { QuestionTypePreview } from "@/components/pages/forms/formAdmin/QuestionTypePreview";
import { QuestionWithAnswerIdsFragment } from "@/generated/graphql";

type Props = {
  question: QuestionWithAnswerIdsFragment;
  /** Function to activate editing mode on this question */
  setActive: () => void;
};

/** Component to preview a question in a form when not in editing mode. */
export const QuestionPreview: React.FC<Props> = ({ question, setActive }) => (
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
