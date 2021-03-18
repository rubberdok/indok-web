import { useQuery, useMutation } from "@apollo/client";
import { SURVEY } from "@graphql/surveys/queries";
import { CREATE_QUESTION, DELETE_QUESTION, UPDATE_QUESTION } from "@graphql/surveys/mutations";
import { useState } from "react";
import { Survey, Question, QuestionVariables } from "@interfaces/surveys";
import QuestionPreview from "@components/pages/surveys/surveyAdmin/questionPreview";
import EditQuestion from "@components/pages/surveys/surveyAdmin/editQuestion";
import { Button, Grid } from "@material-ui/core";

// component to edit surveys (for example the applications to listings)
// props: ID of the survey to edit
const EditSurvey: React.FC<{ surveyId: string }> = ({ surveyId }) => {
  // fetches the survey
  const { loading, error, data } = useQuery<{ survey: Survey }>(SURVEY, {
    variables: { surveyId: surveyId },
  });

  //state to manage which question on the survey is currently being edited (ensures one at a time)
  const [activeQuestion, setActiveQuestion] = useState<Question | undefined>();

  // mutation to create a new question
  const [createQuestion] = useMutation<{ createQuestion: { question: Question } }>(CREATE_QUESTION, {
    // updates the cache upon creating the question, keeping the client consistent with the database
    update: (cache, { data }) => {
      const newQuestion = data?.createQuestion.question;
      const cachedSurvey = cache.readQuery<{ survey: Survey }>({
        query: SURVEY,
        variables: { surveyId: surveyId },
      });
      if (cachedSurvey && newQuestion) {
        cache.writeQuery({
          query: SURVEY,
          variables: { surveyId: surveyId },
          data: {
            survey: {
              questions: [...cachedSurvey.survey.questions, newQuestion],
            },
          },
        });
      }
    },
  });

  // mutation to delete a question
  const [deleteQuestion] = useMutation<{ deleteQuestion: { deletedId: string } }>(DELETE_QUESTION, {
    // updates the cache upon deleting the question
    update: (cache, { data }) => {
      const cachedSurvey = cache.readQuery<{ survey: Survey }>({
        query: SURVEY,
        variables: { surveyId: surveyId },
      });
      const deletedId = data?.deleteQuestion.deletedId;
      if (cachedSurvey && deletedId) {
        cache.writeQuery({
          query: SURVEY,
          variables: { surveyId: surveyId },
          data: {
            survey: {
              questions: cachedSurvey.survey.questions.filter((question) => question.id !== deletedId),
            },
          },
        });
      }
    },
  });

  // mutation to update a question (and its options)
  const [updateQuestion] = useMutation<{ updateQuestion: { question: Question } }, QuestionVariables>(UPDATE_QUESTION, {
    // updates the cache upon updating the question
    update: (cache, { data }) => {
      const newQuestion = data?.updateQuestion.question;
      const cachedSurvey = cache.readQuery<{ survey: Survey }>({
        query: SURVEY,
        variables: { surveyId: surveyId },
      });
      if (cachedSurvey && newQuestion) {
        cache.writeQuery({
          query: SURVEY,
          variables: { surveyId: surveyId },
          data: {
            survey: {
              questions: cachedSurvey.survey.questions.map((question) =>
                question.id === newQuestion.id ? newQuestion : question
              ),
            },
          },
        });
      }
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  // renders a list of the survey's question, with a button to create new ones
  // question view changes based on whether they are being edited or not
  return (
    <>
      {data && (
        <>
          <h3>{data.survey.descriptiveName}</h3>
          <Grid item container direction="column">
            {data.survey.questions.map((question) =>
              question === activeQuestion ? (
                <EditQuestion
                  oldQuestion={question}
                  updateQuestion={updateQuestion}
                  deleteQuestion={deleteQuestion}
                  setInactive={() => setActiveQuestion(undefined)}
                />
              ) : (
                <QuestionPreview
                  question={question}
                  setActive={() => {
                    if (activeQuestion) {
                      updateQuestion({
                        variables: {
                          id: activeQuestion.id,
                          question: activeQuestion.question,
                          description: activeQuestion.description,
                          position: activeQuestion.position,
                          questionType: activeQuestion.questionType,
                          // TODO: update to reflect new position of questionId in OptionInput
                          options: activeQuestion.options.map((option) => ({
                            answer: option.answer,
                            ...(option.id ? { id: option.id } : {}),
                          })),
                        },
                      });
                    }
                    setActiveQuestion(question);
                  }}
                />
              )
            )}
            <Button
              onClick={(e) => {
                e.preventDefault();
                createQuestion({
                  variables: {
                    question: "",
                    description: "",
                    // TODO: implement automatic position generation in backend
                    position:
                      data.survey.questions
                        .map((question) => parseInt(question.position))
                        .reduce((prev, curr) => (prev > curr ? prev : curr), -1) + 1,
                    surveyId: data.survey.id,
                    // TODO: remove when backend fixes default handling
                    questionType: "Paragraph",
                  },
                });
              }}
            >
              Legg til spørsmål
            </Button>
          </Grid>
        </>
      )}
    </>
  );
};

export default EditSurvey;
