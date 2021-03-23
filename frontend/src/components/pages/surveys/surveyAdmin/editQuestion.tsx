import { Question, QuestionVariables } from "@interfaces/surveys";
import { MutationFunctionOptions, FetchResult } from "@apollo/client";
import { useState } from "react";
import QuestionTypePreview from "@components/pages/surveys/surveyAdmin/questionTypePreview";
import { Grid, Button, TextField, Select, MenuItem, Radio, Checkbox } from "@material-ui/core";
import questionTypes from "@components/pages/surveys/surveyAdmin/questionTypes";

// component to edit a question on a survey
/*
  props:
  the question to edit
  the question types a question can have
  updateQuestion mutation to persist the new question to the database (crazy type declaration from Apollo)
  deleteQuestion mutation to delete the question
  setInactive function to exit the edit mode on this question
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
    <Grid container item direction="column">
      <TextField
        title="Spørsmål:"
        value={question.question}
        onChange={(e) => {
          e.preventDefault();
          setQuestion({
            ...question,
            question: e.target.value,
          });
        }}
      />
      <br />
      <Select
        value={question.questionType}
        onChange={(e) => {
          e.preventDefault();
          setQuestion({
            ...question,
            questionType: e.target.value as string,
          });
        }}
      >
        {Object.entries(questionTypes).map(([questionType, label], index) => (
          <MenuItem key={index} value={questionType}>
            {label}
          </MenuItem>
        ))}
      </Select>
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
        <QuestionTypePreview question={question} />
      )}
      <Grid container direction="row" justify="space-evenly">
        <Button
          onClick={(e) => {
            e.preventDefault();
            updateQuestion({
              variables: {
                id: question.id,
                question: question.question,
                description: question.description,
                questionType: question.questionType,
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
        <Button
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
  );
};

export default EditQuestion;
