import { Reference, useMutation } from "@apollo/client";
import { Add } from "@mui/icons-material";
import { Button, Card, CardContent, FormHelperText, Grid, Typography } from "@mui/material";
import { orderBy } from "lodash";
import { useState } from "react";

import ConfirmFormChange from "@/components/pages/forms/formAdmin/ConfirmFormChange";
import EditQuestion from "@/components/pages/forms/formAdmin/EditQuestion";
import QuestionPreview from "@/components/pages/forms/formAdmin/QuestionPreview";
import {
  CreateQuestionDocument,
  DeleteQuestionDocument,
  FormWithAllResponsesFragment,
  QuestionTypeEnum,
  QuestionWithAnswerIdsFragment,
  QuestionWithAnswerIdsFragmentDoc,
  UpdateQuestionDocument,
} from "@/generated/graphql";

type Props = { form: FormWithAllResponsesFragment };

/** Component for editing forms (for example: the applications to listings). */
const EditForm: React.FC<Props> = ({ form }) => {
  // state to manage the question on the form currently being edited
  // undefined if no question is currently being edited
  const [activeQuestion, setActiveQuestion] = useState<QuestionWithAnswerIdsFragment | undefined>();

  // state for whether to show a confirmation dialog after changing the form
  // "update" type also includes toSwitch for question to switch to after confirming
  const [confirmationDialog, setConfirmationDialog] = useState<
    | { type: "create" }
    | { type: "update"; toSwitch: QuestionWithAnswerIdsFragment | undefined }
    | { type: "delete" }
    | undefined
  >(undefined);

  // mutation to create a new question
  const [createQuestion] = useMutation(CreateQuestionDocument, {
    // updates the cache upon creating the question, keeping the client consistent with the database
    update: (cache, { data }) => {
      const question = data?.createQuestion?.question;
      if (question) {
        cache.modify({
          id: cache.identify(form),
          fields: {
            questions(existingQuestions: Reference[] = []) {
              const newQuestionRef = cache.writeFragment({
                data: question,
                fragment: QuestionWithAnswerIdsFragmentDoc,
                fragmentName: "QuestionWithAnswerIds",
              });
              return [...existingQuestions, newQuestionRef];
            },
          },
        });
      }
    },
    onCompleted: ({ createQuestion }) => {
      if (createQuestion?.question) {
        switchActiveQuestion(createQuestion.question);
      }
    },
  });

  // mutation to update a question (and its options)
  const [updateQuestion] = useMutation(UpdateQuestionDocument);

  // mutation to delete the question
  const [deleteQuestion] = useMutation(DeleteQuestionDocument, {
    // updates the cache upon deleting the question
    update: (cache, { data }) => {
      const deletedId = data?.deleteQuestion?.deletedId;
      if (deletedId) {
        cache.evict({ id: `QuestionType:${deletedId}` });
        cache.gc();
      }
    },
  });

  // function to update the current active question to the database and then set a new one
  const switchActiveQuestion = (question: QuestionWithAnswerIdsFragment | undefined) => {
    if (activeQuestion) {
      if (activeQuestion.answers && activeQuestion.answers.length > 0 && confirmationDialog?.type !== "update") {
        setConfirmationDialog({ type: "update", toSwitch: question });
        return;
      } else {
        updateQuestion({
          variables: {
            id: activeQuestion.id,
            questionData: {
              question: activeQuestion.question,
              description: activeQuestion.description,
              questionType: activeQuestion.questionType,
              mandatory: activeQuestion.mandatory,
            },
            optionData:
              activeQuestion.options &&
              (activeQuestion.questionType === QuestionTypeEnum.Checkboxes ||
                activeQuestion.questionType === QuestionTypeEnum.MultipleChoice ||
                activeQuestion.questionType === QuestionTypeEnum.Dropdown)
                ? activeQuestion.options.map((option) => ({
                    // replaces "|||" with empty string in options, as ||| is used to separate checkbox answers
                    // see AnswerCheckboxes for explanation
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
          formId: form.id,
          questionData: { question: "", description: "" },
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
        {orderBy(form.questions, ["id"], ["asc"]).map((question) => (
          // sorts questions by ID (hacky solution to maintain question order until we implement order field)
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
