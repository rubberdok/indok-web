import { useMutation, useQuery } from "@apollo/client";
import AnswerQuestion from "@components/forms/AnswerQuestion";
import { SUBMIT_ANSWERS } from "@graphql/forms/mutations";
import { FORM } from "@graphql/forms/queries";
import { Answer, Form } from "@interfaces/forms";
import { Button, Card, CardContent, Grid, Typography, FormControl, FormLabel } from "@material-ui/core";
import { useState } from "react";

/**
 * component for a user to answer a form
 * props: ID of the form
 */
const AnswerForm: React.FC<{ formId: string }> = ({ formId }) => {
  // state to manage the user's answers before submitting
  const [answers, setAnswers] = useState<Answer[]>();

  // fetches the form
  const { error, loading, data } = useQuery<{ form: Form }>(FORM, {
    variables: { formId: parseInt(formId) },

    // when the fetch completes, map the answers state to the form's questions
    onCompleted({ form }) {
      if (form) {
        setAnswers(form.questions.map((question) => ({ id: "", answer: "", question: question })));
      }
    },
  });

  // mutation to submit answers
  const [submitAnswers] = useMutation<
    // object returned from the mutation
    { ok: boolean },
    // variables of the mutation
    { formId: string; answersData: { questionId: string; answer: string }[] }
  >(SUBMIT_ANSWERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  // maps the answers (which, after the fetch, includes each question) to AnswerQuestion components
  // passes setAnswer prop to each AnswerQuestion component, which updates the relevant Answer on this component's state
  return (
    <>
      {data && (
        <Card>
          <CardContent>
            <Typography variant="h5">{data.form.name}</Typography>
          </CardContent>
          {answers && (
            <Grid container direction="column">
              {answers.map((answer, index) => (
                <CardContent key={index}>
                  <FormControl>
                    <FormLabel>{answer.question.question}</FormLabel>
                    <AnswerQuestion
                      answer={answer}
                      setAnswer={(newAnswer: Answer) =>
                        setAnswers(
                          answers.map((oldAnswer) =>
                            oldAnswer.question.id === newAnswer.question.id ? newAnswer : oldAnswer
                          )
                        )
                      }
                    />
                  </FormControl>
                </CardContent>
              ))}
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  submitAnswers({
                    variables: {
                      formId: formId,
                      answersData: answers.map((answer) => ({
                        questionId: answer.question.id,
                        answer: answer.answer,
                      })),
                    },
                  });
                }}
              >
                Søk
              </Button>
            </Grid>
          )}
        </Card>
      )}
    </>
  );
};

export default AnswerForm;
