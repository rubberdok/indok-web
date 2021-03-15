import { Question, QuestionType, QuestionVariables } from "@interfaces/surveys";
import { MutationFunctionOptions, FetchResult } from "@apollo/client";
import { useState } from "react";
import QuestionTypePreview from "@components/pages/surveys/surveyAdmin/questionTypePreview";
import { Grid, Button, TextField, Select, MenuItem, Radio, Checkbox } from "@material-ui/core";

const EditQuestion: React.FC<{
  oldQuestion: Question;
  questionTypes: QuestionType[];
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
}> = ({ oldQuestion, questionTypes, updateQuestion, deleteQuestion, setInactive }) => {
  const [question, setQuestion] = useState<Question>(oldQuestion);
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
        value={question.questionType.id}
        onChange={(e) => {
          e.preventDefault();
          setQuestion({
            ...question,
            questionType: questionTypes.find((questionType) => questionType.id === e.target.value) ?? questionTypes[0],
          });
        }}
      >
        {questionTypes.map((questionType, index) => (
          <MenuItem key={index} value={questionType.id}>
            {questionType.name}
          </MenuItem>
        ))}
      </Select>
      {question.questionType.name === "Checkboxes" ||
      question.questionType.name === "Multiple choice" ||
      question.questionType.name === "Drop-down" ? (
        <Grid container direction="column">
          {question.options.map((option, index) => (
            <Grid key={index} container direction="row">
              {question.questionType.name === "Checkboxes" ? (
                <Checkbox disabled />
              ) : question.questionType.name === "Multiple choice" ? (
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
                position: question.position,
                questionTypeId: question.questionType.id,
                options: question.options.map((option) => ({
                  answer: option.answer,
                  questionId: question.id,
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
