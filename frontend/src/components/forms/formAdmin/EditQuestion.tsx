import { FetchResult, MutationFunctionOptions } from "@apollo/client";
import QuestionTypePreview from "@components/forms/formAdmin/QuestionTypePreview";
import questionTypeLabels from "@components/forms/formAdmin/questionTypeLabels";
import { Question, QuestionVariables, QuestionType } from "@interfaces/forms";
import {
  Button,
  Checkbox,
  Grid,
  MenuItem,
  Radio,
  Select,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import React, { useState } from "react";

/**
 * component to edit a question on a form
 * props:
 * - the question to edit
 * - the question types a question can have
 * - updateQuestion mutation to persist the new question to the database (crazy type declaration from Apollo)
 * - deleteQuestion mutation to delete the question
 * - setInactive function to exit the edit mode on this question
 */
const EditQuestion: React.FC<{
  oldQuestion: Question;
  updateQuestion: (
    options?:
      | MutationFunctionOptions<
          {
            updateQuestion: {
              question: Question;
            };
          },
          QuestionVariables
        >
      | undefined
  ) => Promise<
    FetchResult<
      {
        updateQuestion: {
          question: Question;
        };
      },
      Record<string, any>
    >
  >;
  deleteQuestion: (
    options?:
      | MutationFunctionOptions<{
          deleteQuestion: {
            deletedId: string;
          };
        }>
      | undefined
  ) => Promise<
    FetchResult<
      {
        deleteQuestion: {
          deletedId: string;
        };
      },
      Record<string, any>
    >
  >;
  setInactive: () => void;
}> = ({ oldQuestion, updateQuestion, deleteQuestion, setInactive }) => {
  // state to manage the question being edited before updating it in the database
  const [question, setQuestion] = useState<Question>(oldQuestion);

  // renders input fields to change the question's details
  // if the question's type allows options, allows the creation of such; otherwise, shows a preview
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <TextField
          label="Spørsmål"
          fullWidth
          value={question.question}
          onChange={(e) => {
            e.preventDefault();
            setQuestion({
              ...question,
              question: e.target.value,
            });
          }}
          variant="filled"
        />
      </Grid>
      <Grid item container direction="row" alignItems="center" spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              fullWidth
              value={question.questionType}
              onChange={(e) => {
                e.preventDefault();
                setQuestion({
                  ...question,
                  questionType: e.target.value as QuestionType,
                });
              }}
              variant="filled"
            >
              {Object.entries(questionTypeLabels).map(([questionType, label]) => (
                <MenuItem key={questionType} value={questionType}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8}>
          <FormControlLabel
            label="Obligatorisk"
            control={
              <Switch
                checked={question.mandatory}
                onChange={(event) => setQuestion({ ...question, mandatory: event.target.checked })}
                color="primary"
              />
            }
          />
        </Grid>
      </Grid>
      {question.questionType === "CHECKBOXES" ||
      question.questionType === "MULTIPLE_CHOICE" ||
      question.questionType === "DROPDOWN" ? (
        <Grid container direction="column">
          {question.options.map((option, index) => (
            <Grid key={index} container direction="row">
              {question.questionType === "CHECKBOXES" ? (
                <Checkbox disabled />
              ) : question.questionType === "MULTIPLE_CHOICE" ? (
                <Radio disabled />
              ) : (
                <p>{index + 1}.</p>
              )}
              <TextField
                value={option.answer}
                onChange={(e) => {
                  e.preventDefault();
                  setQuestion({
                    ...question,
                    options: question.options.map((oldAnswer) =>
                      oldAnswer === option ? { ...oldAnswer, answer: e.target.value } : oldAnswer
                    ),
                  });
                }}
              />
            </Grid>
          ))}
          <Button
            onClick={(e) => {
              e.preventDefault();
              setQuestion({
                ...question,
                options: [...question.options, { id: "", answer: "" }],
              });
            }}
          >
            Nytt svaralternativ
          </Button>
        </Grid>
      ) : (
        <Grid item>
          <QuestionTypePreview question={question} />
        </Grid>
      )}
      <Grid item container direction="row" spacing={1}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              updateQuestion({
                variables: {
                  id: question.id,
                  question: question.question,
                  description: question.description,
                  questionType: question.questionType,
                  mandatory: question.mandatory,
                  options: question.options.map((option) => ({
                    answer: option.answer,
                    ...(option.id ? { id: option.id } : {}),
                  })),
                },
              });
              setInactive();
            }}
          >
            Lagre spørsmål
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              setInactive();
              deleteQuestion({
                variables: { id: question.id },
              });
            }}
          >
            Slett spørsmål
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EditQuestion;
