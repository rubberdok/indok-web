import { useQuery, useMutation } from "@apollo/client";
import { SURVEY } from "@graphql/surveys/queries";
import { Survey, Answer } from "@interfaces/surveys";
import AnswerQuestion from "@components/pages/surveys/answerQuestion";
import { Typography, Grid, Button } from "@material-ui/core";
import { useState } from "react";
import { SUBMIT_ANSWERS } from "@graphql/surveys/mutations";

const AnswerSurvey: React.FC<{ surveyId: string }> = ({ surveyId }) => {
  const [answers, setAnswers] = useState<Answer[]>();
  const { error, loading, data } = useQuery<{ survey: Survey }>(SURVEY, {
    variables: { surveyId: parseInt(surveyId) },
    onCompleted({ survey }) {
      if (survey) {
        setAnswers(survey.questions.map((question) => ({ id: "", answer: "", question: question })));
      }
    },
  });
  const [submitAnswers] = useMutation(SUBMIT_ANSWERS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  return (
    <>
      {data && (
        <>
          <Typography variant="h1" component="h1">
            {data.survey.descriptiveName}
          </Typography>
          {answers && (
            <Grid container direction="column">
              {answers.map((answer, index) => (
                <Grid item container key={index}>
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
                </Grid>
              ))}
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  submitAnswers({
                    variables: {
                      answersData: answers.map((answer) => ({ questionId: answer.question.id, answer: answer.answer })),
                    },
                  });
                }}
              >
                Søk
              </Button>
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default AnswerSurvey;
