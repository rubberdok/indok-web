import { Question, QuestionType, QuestionVariables } from "@interfaces/surveys";
import { MutationFunctionOptions, FetchResult } from "@apollo/client";
import TextField from "@components/ui/formComponents/textfield";
import Dropdown from "@components/ui/formComponents/dropdown";
import Choice from "@components/ui/formComponents/choice";
import { useState } from "react";
import QuestionTypePreview from "@components/pages/surveys/surveyCreation/questionTypePreview";

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
    <>
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
      <Dropdown
        title="Type"
        options={questionTypes.map((type) => ({
          text: type.name,
          value: type.id,
          ...(type === question.questionType && { selected: true }),
        }))}
        onChange={(e) => {
          e.preventDefault();
          setQuestion({
            ...question,
            questionType: questionTypes.find((type) => type.id === e.target.value) ?? questionTypes[0],
          });
        }}
      />
      {question.questionType.name === "Checkboxes" || question.questionType.name === "Multiple Choice" ? (
        <ul>
          {question.offeredAnswers.map((offeredAnswer, index) => (
            <li key={index}>
              <label>
                <input
                  type={question.questionType.name === "Checkboxes" ? "checkbox" : "radio"}
                  name={question.id}
                  disabled
                />
                <TextField
                  value={offeredAnswer.answer}
                  onChange={(e) => {
                    e.preventDefault();
                    setQuestion({
                      ...question,
                      offeredAnswers: question.offeredAnswers.map((oldAnswer) =>
                        oldAnswer.id === offeredAnswer.id ? { ...oldAnswer, answer: e.target.value } : oldAnswer
                      ),
                    });
                  }}
                />
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <QuestionTypePreview question={question} />
      )}
      <br />
      <button
        onClick={(e) => {
          e.preventDefault();
          updateQuestion({
            variables: {
              id: question.id,
              question: question.question,
              description: question.description,
              position: question.position,
              questionTypeId: question.questionType.id,
            },
          });
          setInactive();
        }}
      >
        Lagre spørsmål
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          setInactive();
          deleteQuestion({
            variables: { id: question.id },
          });
        }}
      >
        Slett spørsmål
      </button>
    </>
  );
};

export default EditQuestion;
