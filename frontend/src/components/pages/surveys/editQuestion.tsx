import { Question, QuestionType, QuestionVariables } from "@interfaces/surveys";
import { UPDATE_QUESTION } from "@graphql/surveys/mutations";
import { SURVEY } from "@graphql/surveys/queries";
import { useMutation, MutationFunctionOptions, FetchResult } from "@apollo/client";
import TextField from "@components/pages/surveys/formComponents/textfield";
import Dropdown from "@components/pages/surveys/formComponents/dropdown";
import Choice from "@components/pages/surveys/formComponents/choice";
import { useState } from "react";

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
    FetchResult<{
      updateQuestion: {
        question: Question;
      };
    }>
  >;
  setInactive: () => void;
}> = ({ oldQuestion, questionTypes, updateQuestion, setInactive }) => {
  const [question, setQuestion] = useState<Question>(oldQuestion);

  const questionComponent = (questionType: QuestionType) => {
    console.log(question);
    switch (questionType.name) {
      case "Short answer":
        return <TextField title={question.question} size="short" disabled value="Kortsvar" />;
      case "Paragraph":
        return <TextField title={question.question} size="long" disabled value="Langsvar" />;
      case "Multiple choice":
        return (
          <Choice
            title={question.question}
            radio={true}
            options={question.offeredAnswers.map((offeredAnswer) => offeredAnswer.answer)}
          />
        );
      case "Checkboxes":
        return (
          <Choice
            title={question.question}
            radio={false}
            options={question.offeredAnswers.map((offeredAnswer) => offeredAnswer.answer)}
          />
        );
      default:
        return <TextField title={question.question} disabled />;
    }
  };
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
        options={questionTypes.map((type) => type.name)}
        onChange={(e) => {
          e.preventDefault();
          setQuestion({
            ...question,
            questionType: questionTypes.find((type) => type.name === e.target.value) ?? questionTypes[0],
          });
        }}
      />
      {questionComponent(question.questionType)}
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
    </>
  );
};

export default EditQuestion;
