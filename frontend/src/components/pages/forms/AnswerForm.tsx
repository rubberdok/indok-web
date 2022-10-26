import { useMutation } from "@apollo/client";
import { Send } from "@mui/icons-material";
import { Button, Card, CardContent, FormHelperText, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

import { FormWithAnswersFragment, QuestionWithAnswerFragment, SubmitAnswersDocument } from "@/generated/graphql";

import { AnswerQuestion } from "./AnswerQuestion";

// Type for the state of answers before pushing to the database
type Questions = Record<string, { question: QuestionWithAnswerFragment; answer: string }>;

type Props = { form: FormWithAnswersFragment };

/** Component for a user to answer a form. */
export const AnswerForm: React.FC<React.PropsWithChildren<Props>> = ({ form }) => {
  // state to manage the user's answers before submitting
  const [questions, setQuestions] = useState<Questions>(
    Object.fromEntries(
      form.questions.map((question) => [question.id, { question: question, answer: question?.answer?.answer || "" }])
    )
  );

  const router = useRouter();

  // state to store feedback to the user
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  // mutation to submit answers
  const [submitAnswers] = useMutation(SubmitAnswersDocument, {
    onCompleted: ({ submitAnswers }) => {
      if (!submitAnswers) return;
      if (submitAnswers.ok) {
        router.push("/");
      } else {
        setErrorMessage(submitAnswers.message ?? undefined);
      }
    },
  });

  // maps the answers/questions to AnswerQuestion components
  // passes setAnswer prop to each AnswerQuestion, which updates the relevant Answer on this component's state
  return (
    <Grid container direction="column" spacing={1} style={{ marginTop: 32, marginBottom: 16 }}>
      <Grid item>
        <Card>
          <CardContent>
            <Typography variant="h5">{form.name}</Typography>
            <FormHelperText>* Obligatorisk spørsmål</FormHelperText>
          </CardContent>
        </Card>
      </Grid>
      {Object.entries(questions)
        // sorts questions by ID (hacky solution to maintain question order until we implement order field)
        .sort(([id1], [id2]) => (parseInt(id1) || 0) - (parseInt(id2) || 0))
        .map(([id, { question, answer }]) => (
          <Grid item key={id}>
            <Card>
              <CardContent>
                <Grid container direction="column">
                  <Grid item>
                    <Typography>
                      {question.question}
                      {question.mandatory && " *"}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <AnswerQuestion
                      question={question}
                      answer={answer}
                      onAnswerChange={(value) =>
                        setQuestions((prevState) => ({ ...prevState, [id]: { ...prevState[id], answer: value } }))
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      {errorMessage && (
        <Grid item>
          <Card>
            <CardContent>
              <FormHelperText error>{errorMessage}</FormHelperText>
            </CardContent>
          </Card>
        </Grid>
      )}
      <Grid item>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<Send />}
          onClick={() => {
            const answersData = Object.entries(questions).map(([id, { answer }]) => ({
              answer: answer,
              questionId: id,
            }));
            let error = { error: false, message: "" };
            Object.entries(questions).forEach(([, { question, answer }]) => {
              if (question.mandatory && answer === "") {
                error = { error: true, message: "Du må svare på alle obligatoriske spørsmål." };
              }
            });
            if (error.error) {
              setErrorMessage(error.message);
            } else {
              setErrorMessage(undefined);
              submitAnswers({
                variables: {
                  formId: form.id,
                  answersData: answersData,
                },
              });
            }
          }}
        >
          Send søknad
        </Button>
      </Grid>
    </Grid>
  );
};
