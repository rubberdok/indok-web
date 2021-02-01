import { useQuery, useMutation } from "@apollo/client";
import { QUESTIONTYPES } from "@graphql/surveys/queries";
import { UPDATE_SURVEY, CREATE_QUESTION } from "@graphql/surveys/mutations";
import { useState } from "react";
import { Survey, QuestionType, Question } from "@interfaces/surveys";
import QuestionDetail from "@components/pages/surveys/questionDetail";
import EditQuestion from "@components/pages/surveys/editQuestion";

const EditSurvey: React.FC<{ oldSurvey: Survey }> = ({ oldSurvey }) => {
  const [survey, setSurvey] = useState<Survey>(oldSurvey);
  const [activeQuestion, setActiveQuestion] = useState<Question | undefined>();
  const replaceOrAddQuestion = (questions: Question[], question: Question) => {
    let added = false;
    questions = questions.map((oldQuestion) => {
      if (oldQuestion.id === question.id) {
        added = true;
        return question;
      } else {
        return oldQuestion;
      }
    });
    if (!added) {
      setActiveQuestion(question);
      return [...questions, question];
    }
    return questions;
  };
  const setQuestion = (question: Question) => {
    setSurvey({
      ...survey,
      questions: replaceOrAddQuestion(survey.questions, question),
    });
  };
  const { loading: questionTypeLoading, error: questionTypeError, data: questionTypeData } = useQuery<{
    questionTypes: QuestionType[];
  }>(QUESTIONTYPES);
  const [updateSurvey] = useMutation(UPDATE_SURVEY);
  const [createQuestion] = useMutation<{ createQuestion: { question: Question } }>(CREATE_QUESTION, {
    onCompleted({ createQuestion: { question } }) {
      setQuestion(question);
    },
  });
  if (questionTypeLoading) return <p>Loading...</p>;
  if (questionTypeError) return <p>Error</p>;
  return (
    <>
      <h3>{survey.descriptiveName}</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateSurvey();
        }}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            createQuestion({
              variables: {
                question: "",
                description: "",
                position:
                  survey.questions
                    .map((question) => parseInt(question.position))
                    .reduce((prev, curr) => (prev > curr ? prev : curr), -1) + 1,
                surveyId: `${survey.id}`,
              },
            });
          }}
        >
          Nytt spørsmål
        </button>
        {questionTypeData && (
          <ul>
            {survey.questions.map((question) =>
              question === activeQuestion ? (
                <EditQuestion
                  question={question}
                  setQuestion={setQuestion}
                  setActiveQuestion={setActiveQuestion}
                  questionTypes={questionTypeData.questionTypes}
                />
              ) : (
                <QuestionDetail
                  question={question as Question}
                  setActiveQuestion={setActiveQuestion}
                  key={question.id}
                />
              )
            )}
          </ul>
        )}
        <br />
        <button type="submit">Lagre søknad</button>
      </form>
    </>
  );
};

export default EditSurvey;
