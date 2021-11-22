import { useMutation } from "@apollo/client";
import EditQuestion from "@components/forms/formAdmin/EditQuestion";
import QuestionPreview from "@components/forms/formAdmin/QuestionPreview";
import { CREATE_QUESTION, UPDATE_QUESTION, DELETE_QUESTION } from "@graphql/forms/mutations";
import { FORM_RESPONSES_FRAGMENT } from "@graphql/forms/fragments";
import { Question, QuestionVariables, Form } from "@interfaces/forms";
import { Button, Grid, Typography, Card, CardContent, FormHelperText } from "@mui/material";
import { useState } from "react";
import { Add } from "@mui/icons-material";
import ConfirmFormChange from "@components/forms/formAdmin/ConfirmFormChange";

/**
 * Component for editing forms (for example: the applications to listings).
 *
 * Props:
 * - the form to edit
 */
const EditForm: React.FC<{ form: Form }> = ({ form }) => {
  // state to manage the question on the form currently being edited
  // undefined if no question is currently being edited
  const [activeQuestion, setActiveQuestion] = useState<Question | undefined>();

  // state for whether to show a confirmation dialog after changing the form
  // "update" type also includes toSwitch for question to switch to after confirming
  const [confirmationDialog, setConfirmationDialog] = useState<
    { type: "create" } | { type: "update"; toSwitch: Question | undefined } | { type: "delete" } | undefined
  >(undefined);

  // mutation to create a new question
  const [createQuestion] = useMutation<{ createQuestion: { question: Question } }>(CREATE_QUESTION, {
    // updates the cache upon creating the question, keeping the client consistent with the database
    update: (cache, { data }) => {
      // gets the new question from the mutation's return
      const newQuestion = data?.createQuestion.question;
      // reads the cached form on which to update the question
      const cachedForm = cache.readFragment<Form>({
        id: `FormType:${form.id}`,
        fragment: FORM_RESPONSES_FRAGMENT,
        fragmentName: "FormResponsesFragment",
      });
      if (cachedForm && newQuestion) {
        // adds the new question to the questions field of the cached form
        cache.writeFragment({
          id: `FormType:${form.id}`,
          fragment: FORM_RESPONSES_FRAGMENT,
          fragmentName: "FormResponsesFragment",
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
        fragment: FORM_RESPONSES_FRAGMENT,
        fragmentName: "FormResponsesFragment",
      });
      if (cachedForm && newQuestion) {
        cache.writeFragment({
          id: `FormType:${form.id}`,
          fragment: FORM_RESPONSES_FRAGMENT,
          fragmentName: "FormResponsesFragment",
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
        fragment: FORM_RESPONSES_FRAGMENT,
        fragmentName: "FormResponsesFragment",
      });
      const deletedId = data?.deleteQuestion.deletedId;
      if (cachedForm && deletedId) {
        cache.writeFragment({
          id: `FormType:${form.id}`,
          fragment: FORM_RESPONSES_FRAGMENT,
          fragmentName: "FormResponsesFragment",
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
      if (activeQuestion.answers && activeQuestion.answers.length > 0 && confirmationDialog?.type !== "update") {
        setConfirmationDialog({ type: "update", toSwitch: question });
        return;
      } else {
        updateQuestion({
          variables: {
            id: activeQuestion.id,
            question: activeQuestion.question,
            description: activeQuestion.description,
            questionType: activeQuestion.questionType,
            mandatory: activeQuestion.mandatory,
            options:
              activeQuestion.options &&
              (activeQuestion.questionType === "CHECKBOXES" ||
                activeQuestion.questionType === "MULTIPLE_CHOICE" ||
                activeQuestion.questionType === "DROPDOWN")
                ? activeQuestion.options.map((option) => ({
                    // replaces "|||" with empty string in options, as ||| is used to separate checkbox answers (see AnswerCheckboxes)
                    answer: option.answer.replace(/\|\|\|/g, ""),
                    ...(option.id ? { id: option.id } : {}),
                  }))
                : [],
          },
        });
      }
    }
    setActiveQuestion(question);
  };

  // function to create a new question, showing a confirmation dialog if the form already has responses
  const newQuestion = () => {
    if (form.responses && form.responses.length > 0 && confirmationDialog?.type !== "create") {
      setConfirmationDialog({ type: "create" });
    } else {
      createQuestion({
        variables: {
          question: "",
          description: "",
          formId: form.id,
        },
      });
    }
  };

  // function to delete the current active question from the database and then set it as inactive
  // shows confirmation dialog if question has answers
  const deleteActiveQuestion = () => {
    if (activeQuestion) {
      if (activeQuestion.answers && activeQuestion.answers.length > 0 && confirmationDialog?.type !== "delete") {
        setConfirmationDialog({ type: "delete" });
      } else {
        deleteQuestion({ variables: { id: activeQuestion.id } });
        setActiveQuestion(undefined);
      }
    }
  };

  // renders a list of the form's question, with a button to create new ones
  // question view changes based on whether they are being edited or not
  return (
    <>
      {confirmationDialog && (
        <ConfirmFormChange
          type={confirmationDialog.type}
          open={confirmationDialog !== undefined}
          onConfirm={() => {
            switch (confirmationDialog.type) {
              case "create":
                newQuestion();
                return;
              case "update":
                switchActiveQuestion(confirmationDialog.toSwitch);
                return;
              case "delete":
                deleteActiveQuestion();
                return;
            }
          }}
          onClose={() => setConfirmationDialog(undefined)}
        />
      )}
      <Grid item container direction="column" spacing={1}>
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="h5">{form.name}</Typography>
              <FormHelperText>* Obligatorisk spørsmål</FormHelperText>
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
                    deleteQuestion={deleteActiveQuestion}
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
            onClick={() => {
              newQuestion();
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
