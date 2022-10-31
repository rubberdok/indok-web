import { Grid, Typography } from "@mui/material";

import { AnswerWithQuestionIdFragment, QuestionTypeEnum, QuestionWithAnswerIdsFragment } from "@/generated/graphql";

import { QuestionTypePreview } from "./QuestionTypePreview";

type Props = {
  question: QuestionWithAnswerIdsFragment;
  /** Undefined if responder gave no answer */
  answer: AnswerWithQuestionIdFragment | undefined;
};

/** Component to show an answer to a question on a form. */
export const FormAnswer: React.FC<Props> = ({ question, answer }) => {
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
          {question.questionType === QuestionTypeEnum.MultipleChoice ||
          question.questionType === QuestionTypeEnum.Dropdown ? (
            <QuestionTypePreview question={question} answer={answer.answer} />
          ) : question.questionType === QuestionTypeEnum.Checkboxes ? (
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
