import { useMutation, useQuery } from "@apollo/client";
import EditQuestion from "@components/forms/formAdmin/EditQuestion";
import QuestionPreview from "@components/forms/formAdmin/QuestionPreview";
import { CREATE_QUESTION, UPDATE_QUESTION } from "@graphql/forms/mutations";
import { FORM } from "@graphql/forms/queries";
import { Question, QuestionVariables, Form } from "@interfaces/forms";
import { Button, Grid, Typography, Card, CardContent } from "@material-ui/core";
import { useState } from "react";
import { Add } from "@material-ui/icons";
import DeleteQuestion from "@components/forms/formAdmin/DeleteQuestion";

/**
 * component to edit forms (for example the applications to listings)
 * props: ID of the form to edit
 */
const EditForm: React.FC<{ formId: string }> = ({ formId }) => {
  // fetches the form
  const { loading, error, data } = useQuery<{ form: Form }>(FORM, {
    variables: { formId: formId },
  });

  // mutation to update a question (and its options)
  const [updateQuestion] = useMutation<{ updateQuestion: { question: Question } }, QuestionVariables>(UPDATE_QUESTION, {
    // updates the cache upon updating the question, keeping the client consistent with the database
    update: (cache, { data }) => {
      const newQuestion = data?.updateQuestion.question;
      // reads the cached form on which to update the question
      const cachedForm = cache.readQuery<{ form: Form }>({
        query: FORM,
        variables: { formId: formId },
      });
      if (cachedForm && newQuestion) {
        // overwrites the outdated question with the updated one
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

  // state to manage the question on the form currently being edited
  // undefined if no question is currently being edited
  const [activeQuestion, setActiveQuestion] = useState<Question | undefined>();

  // state for whether to show the DeleteQuestion confirmation dialog
  const [deleteDialogShown, showDeleteDialog] = useState<boolean>();

  // function to update the current active question to the database and then set a new one
  const switchActiveQuestion = (question: Question | undefined) => {
    if (activeQuestion) {
      updateQuestion({
        variables: {
          id: activeQuestion.id,
          question: activeQuestion.question,
          description: activeQuestion.description,
          questionType: activeQuestion.questionType,
          mandatory: activeQuestion.mandatory,
          options:
            activeQuestion.questionType === "CHECKBOXES" ||
            activeQuestion.questionType === "MULTIPLE_CHOICE" ||
            activeQuestion.questionType === "DROPDOWN"
              ? activeQuestion.options.map((option) => ({
                  answer: option.answer,
                  ...(option.id ? { id: option.id } : {}),
                }))
              : [],
        },
      });
    }
    setActiveQuestion(question);
  };

  // mutation to create a new question
  const [createQuestion] = useMutation<{ createQuestion: { question: Question } }>(CREATE_QUESTION, {
    // updates the cache upon creating the question
    update: (cache, { data }) => {
      const newQuestion = data?.createQuestion.question;
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
              questions: [...cachedForm.form.questions, newQuestion],
            },
          },
        });
      }
    },
    onCompleted: ({ createQuestion }) => {
      if (createQuestion) {
        switchActiveQuestion(createQuestion.question);
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
          {deleteDialogShown && activeQuestion && (
            <DeleteQuestion
              questionId={activeQuestion.id}
              formId={data.form.id}
              onClose={() => showDeleteDialog(false)}
            />
          )}
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
                    {question.id === activeQuestion?.id ? (
                      <EditQuestion
                        question={activeQuestion}
                        setQuestion={(question) => setActiveQuestion(question)}
                        saveQuestion={() => switchActiveQuestion(undefined)}
                        showDeleteDialog={() => showDeleteDialog(true)}
                      />
                    ) : (
                      <QuestionPreview question={question} setActive={() => switchActiveQuestion(question)} />
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
