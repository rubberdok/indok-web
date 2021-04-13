import { useMutation, useQuery } from "@apollo/client";
import EditQuestion from "@components/forms/formAdmin/EditQuestion";
import QuestionPreview from "@components/forms/formAdmin/QuestionPreview";
import { CREATE_QUESTION, DELETE_QUESTION, UPDATE_QUESTION } from "@graphql/forms/mutations";
import { FORM } from "@graphql/forms/queries";
import { Question, QuestionVariables, Form } from "@interfaces/forms";
import { Button, Grid, Typography, Card, CardContent } from "@material-ui/core";
import { useState } from "react";
import { Add } from "@material-ui/icons";

/**
 * component to edit forms (for example the applications to listings)
 * props: ID of the form to edit
 */
const EditForm: React.FC<{ formId: string }> = ({ formId }) => {
  // fetches the form
  const { loading, error, data } = useQuery<{ form: Form }>(FORM, {
    variables: { formId: formId },
  });

  //state to manage which question on the form is currently being edited (ensures one at a time)
  const [activeQuestion, setActiveQuestion] = useState<Question | undefined>();

  // mutation to create a new question
  const [createQuestion] = useMutation<{ createQuestion: { question: Question } }>(CREATE_QUESTION, {
    // updates the cache upon creating the question, keeping the client consistent with the database
    update: (cache, { data }) => {
      const newQuestion = data?.createQuestion.question;
      // reads the cached form to which to add the question
      const cachedForm = cache.readQuery<{ form: Form }>({
        query: FORM,
        variables: { formId: formId },
      });
      if (cachedForm && newQuestion) {
        // writes the new question to the form
        cache.writeQuery({
          query: FORM,
          variables: { formId: formId },
          data: {
            form: {
              questions: [...cachedForm.form.questions, newQuestion],
            },
          },
        });
      }
    },
  });

  // mutation to delete a question
  const [deleteQuestion] = useMutation<{ deleteQuestion: { deletedId: string } }>(DELETE_QUESTION, {
    // updates the cache upon deleting the question
    update: (cache, { data }) => {
      const cachedForm = cache.readQuery<{ form: Form }>({
        query: FORM,
        variables: { formId: formId },
      });
      const deletedId = data?.deleteQuestion.deletedId;
      if (cachedForm && deletedId) {
        cache.writeQuery({
          query: FORM,
          variables: { formId: formId },
          data: {
            form: {
              questions: cachedForm.form.questions.filter((question) => question.id !== deletedId),
            },
          },
        });
      }
    },
  });

  // mutation to update a question (and its options)
  const [updateQuestion] = useMutation<{ updateQuestion: { question: Question } }, QuestionVariables>(UPDATE_QUESTION, {
    // updates the cache upon updating the question
    update: (cache, { data }) => {
      const newQuestion = data?.updateQuestion.question;
      const cachedForm = cache.readQuery<{ form: Form }>({
        query: FORM,
        variables: { formId: formId },
      });
      if (cachedForm && newQuestion) {
        cache.writeQuery({
          query: FORM,
          variables: { formId: formId },
          data: {
            form: {
              questions: cachedForm.form.questions.map((question) =>
                question.id === newQuestion.id ? newQuestion : question
              ),
            },
          },
        });
      }
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  // renders a list of the form's question, with a button to create new ones
  // question view changes based on whether they are being edited or not
  return (
    <>
      {data && (
        <>
          <Grid item container direction="column" spacing={1}>
            <Grid item>
              <Card>
                <CardContent>
                  <Typography variant="h5">{data.form.name}</Typography>
                  <Typography>* = obligatorisk spørsmål</Typography>
                </CardContent>
              </Card>
            </Grid>
            {data.form.questions.map((question) => (
              <Grid item key={question.id}>
                <Card>
                  <CardContent>
                    {question === activeQuestion ? (
                      <EditQuestion
                        oldQuestion={question}
                        updateQuestion={updateQuestion}
                        deleteQuestion={deleteQuestion}
                        setInactive={() => setActiveQuestion(undefined)}
                      />
                    ) : (
                      <QuestionPreview
                        question={question}
                        setActive={() => {
                          if (activeQuestion) {
                            updateQuestion({
                              variables: {
                                id: activeQuestion.id,
                                question: activeQuestion.question,
                                description: activeQuestion.description,
                                questionType: activeQuestion.questionType,
                                mandatory: activeQuestion.mandatory,
                                options: activeQuestion.options.map((option) => ({
                                  answer: option.answer,
                                  ...(option.id ? { id: option.id } : {}),
                                })),
                              },
                            });
                          }
                          setActiveQuestion(question);
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid item>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={(e) => {
                  e.preventDefault();
                  createQuestion({
                    variables: {
                      question: "",
                      description: "",
                      formId: data.form.id,
                      // TODO: remove when default handling is fixed backend
                      questionType: "PARAGRAPH",
                      mandatory: true,
                    },
                  });
                }}
              >
                Nytt spørsmål
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default EditForm;
