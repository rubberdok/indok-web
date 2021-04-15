import { useMutation } from "@apollo/client";
import EditQuestion from "@components/forms/formAdmin/EditQuestion";
import QuestionPreview from "@components/forms/formAdmin/QuestionPreview";
import { CREATE_QUESTION, UPDATE_QUESTION, DELETE_QUESTION } from "@graphql/forms/mutations";
import { FORM_FRAGMENT } from "@graphql/forms/fragments";
import { Question, QuestionVariables, Form } from "@interfaces/forms";
import { Button, Grid, Typography, Card, CardContent } from "@material-ui/core";
import { useState } from "react";
import { Add } from "@material-ui/icons";
import DeleteQuestion from "@components/forms/formAdmin/DeleteQuestion";

/**
 * component to edit forms (for example the applications to listings)
 * props: the form to edit
 */
const EditForm: React.FC<{ form: Form }> = ({ form }) => {
  // state to manage the question on the form currently being edited
  // undefined if no question is currently being edited
  const [activeQuestion, setActiveQuestion] = useState<Question | undefined>();

  // state for whether to show the DeleteQuestion confirmation dialog
  const [deleteDialogShown, showDeleteDialog] = useState<boolean>();

  // mutation to create a new question
  const [createQuestion] = useMutation<{ createQuestion: { question: Question } }>(CREATE_QUESTION, {
    // updates the cache upon creating the question, keeping the client consistent with the database
    update: (cache, { data }) => {
      // gets the new question from the mutation's return
      const newQuestion = data?.createQuestion.question;
      // reads the cached form on which to update the question
      const cachedForm = cache.readFragment<Form>({
        id: `FormType:${form.id}`,
        fragment: FORM_FRAGMENT,
      });
      if (cachedForm && newQuestion) {
        // adds the new question to the questions field of the cached form
        cache.writeFragment({
          id: `FormType:${form.id}`,
          fragment: FORM_FRAGMENT,
          data: {
            questions: [...cachedForm.questions, newQuestion],
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

  // mutation to update a question (and its options)
  const [updateQuestion] = useMutation<{ updateQuestion: { question: Question } }, QuestionVariables>(UPDATE_QUESTION, {
    // updates the cache upon updating the question
    update: (cache, { data }) => {
      const newQuestion = data?.updateQuestion.question;
      const cachedForm = cache.readFragment<Form>({
        id: `FormType:${form.id}`,
        fragment: FORM_FRAGMENT,
      });
      if (cachedForm && newQuestion) {
        cache.writeFragment({
          id: `FormType:${form.id}`,
          fragment: FORM_FRAGMENT,
          data: {
            questions: cachedForm.questions.map((question) =>
              question.id === newQuestion.id ? newQuestion : question
            ),
          },
        });
      }
    },
  });

  // mutation to delete the question
  const [deleteQuestion] = useMutation<{ deleteQuestion: { deletedId: string } }>(DELETE_QUESTION, {
    // updates the cache upon deleting the question
    update: (cache, { data }) => {
      const cachedForm = cache.readFragment<Form>({
        id: `FormType:${form.id}`,
        fragment: FORM_FRAGMENT,
      });
      const deletedId = data?.deleteQuestion.deletedId;
      if (cachedForm && deletedId) {
        cache.writeFragment({
          id: `FormType:${form.id}`,
          fragment: FORM_FRAGMENT,
          data: {
            questions: cachedForm.questions.filter((question) => question.id !== deletedId),
          },
        });
      }
    },
  });

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

  // renders a list of the form's question, with a button to create new ones
  // question view changes based on whether they are being edited or not
  return (
    <>
      {deleteDialogShown && activeQuestion && (
        <DeleteQuestion
          questionId={activeQuestion.id}
          deleteQuestion={(id) => deleteQuestion({ variables: { id: id } })}
          onClose={() => showDeleteDialog(false)}
        />
      )}
      <Grid item container direction="column" spacing={1}>
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="h5">{form.name}</Typography>
              <Typography>* = obligatorisk spørsmål</Typography>
            </CardContent>
          </Card>
        </Grid>
        {form.questions.map((question) => (
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
                  formId: form.id,
                },
              });
            }}
          >
            Nytt spørsmål
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default EditForm;
