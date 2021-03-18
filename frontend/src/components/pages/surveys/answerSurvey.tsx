import { useQuery, useMutation } from "@apollo/client";
import { SURVEY } from "@graphql/surveys/queries";
import { Survey, Answer } from "@interfaces/surveys";
import AnswerQuestion from "@components/pages/surveys/answerQuestion";
import { Typography, Grid, Button, Card, CardContent } from "@material-ui/core";
import { useState } from "react";
import { SUBMIT_ANSWERS } from "@graphql/surveys/mutations";

// component for a user to answer a survey
// props: ID of the survey
const AnswerSurvey: React.FC<{ surveyId: string }> = ({ surveyId }) => {
  // state to manage the user's answers before submitting
  const [answers, setAnswers] = useState<Answer[]>();

  // fetches the survey
  const { error, loading, data } = useQuery<{ survey: Survey }>(SURVEY, {
    variables: { surveyId: parseInt(surveyId) },

    // when the fetch completes, map the answers state to the survey's questions
    onCompleted({ survey }) {
      if (survey) {
        setAnswers(survey.questions.map((question) => ({ id: "", answer: "", question: question })));
      }
    },
  });

  // mutation to submit answers
  const [submitAnswers] = useMutation(SUBMIT_ANSWERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  // maps the answers (which, after the fetch, includes each question) to AnswerQuestion components
  // passes setAnswer prop to each AnswerQuestion component, that updates the relevant Answer on this component's state
  return (
    <>
      {data && (
        <Card>
          <CardContent>
            <Typography variant="h1" component="h1">
              {data.survey.descriptiveName}
            </Typography>
          </CardContent>
          {answers && (
            <Grid container direction="column">
              {answers.map((answer, index) => (
                <CardContent key={index}>
                  <AnswerQuestion
                    answer={answer}
                    setAnswer={(newAnswer: Answer) =>
                      setAnswers(
                        answers.map((oldAnswer) =>
                          oldAnswer.question.id === newAnswer.question.id ? newAnswer : oldAnswer
                        )
                      )
                    }
                  />
                </CardContent>
              ))}
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  submitAnswers({
                    variables: {
                      surveyId: surveyId,
                      answersData: answers.map((answer) => ({
                        questionId: answer.question.id,
                        answer: answer.answer,
                      })),
                    },
                  });
                }}
              >
                Søk
              </Button>
            </Grid>
          )}
        </Card>
      )}
    </>
  );
};

export default AnswerSurvey;
