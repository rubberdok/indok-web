import { useMutation } from "@apollo/client";
import AnswerQuestion from "@components/forms/AnswerQuestion";
import { SUBMIT_ANSWERS } from "@graphql/forms/mutations";
import { Form, Question } from "@interfaces/forms";
import { Button, Card, CardContent, Grid, Typography, FormHelperText } from "@material-ui/core";
import { useState } from "react";
import { Send } from "@material-ui/icons";

// interface for the state of answers before pushing to the database
export interface AnswerState {
  answer: string;
  question: Question;
}

/**
 * Component for a user to answer a form.
 *
 * Props:
 * - the form to answer
 */
const AnswerForm: React.FC<{
  form: Form;
}> = ({ form }) => {
  // state to manage the user's answers before submitting
  const [answers, setAnswers] = useState<AnswerState[]>(
    form.questions.map((question) => ({ answer: "", question: question }))
  );

  // state to store feedback to the user
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  // mutation to submit answers
  const [submitAnswers] = useMutation<
    // object returned from the mutation
    { ok: boolean },
    // variables of the mutation
    { formId: string; answersData: { questionId: string; answer: string }[] }
  >(SUBMIT_ANSWERS);

  // maps the answers/questions to AnswerQuestion components
  // passes setAnswer prop to each AnswerQuestion, which updates the relevant Answer on this component's state
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Card>
          <CardContent>
            <Typography variant="h5">{form.name}</Typography>
            <FormHelperText>* Obligatorisk spørsmål</FormHelperText>
          </CardContent>
        </Card>
      </Grid>
      {answers.map((answer) => (
        <Grid item key={answer.question.id}>
          <Card>
            <CardContent>
              <Grid container direction="column">
                <Grid item>
                  <Typography>
                    {answer.question.question}
                    {answer.question.mandatory && " *"}
                  </Typography>
                </Grid>
                <Grid item>
                  <AnswerQuestion
                    answer={answer}
                    setAnswer={(newAnswer: AnswerState) =>
                      setAnswers(
                        answers.map((oldAnswer) =>
                          oldAnswer.question.id === newAnswer.question.id ? newAnswer : oldAnswer
                        )
                      )
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
            const answersData: { answer: string; questionId: string }[] = [];
            for (const answer of answers) {
              if (answer.answer !== "") {
                answersData.push({ answer: answer.answer, questionId: answer.question.id });
              } else if (answer.question.mandatory) {
                setErrorMessage("Du må svare på alle obligatoriske spørsmål.");
                return;
              }
            }
            setErrorMessage(undefined);
            submitAnswers({
              variables: {
                formId: form.id,
                answersData: answersData,
              },
            });
          }}
        >
          Send søknad
        </Button>
      </Grid>
    </Grid>
  );
};

export default AnswerForm;
