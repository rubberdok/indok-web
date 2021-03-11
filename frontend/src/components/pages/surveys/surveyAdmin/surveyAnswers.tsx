import { User } from "@interfaces/users";
import { SURVEY_ANSWERS } from "@graphql/surveys/queries";
import { useQuery } from "@apollo/client";
import { Question, Answer } from "@interfaces/surveys";
import { Typography } from "@material-ui/core";

type QuestionWithAnswer = Question & {
  answer: Answer;
};

const SurveyAnswers: React.FC<{
  surveyId: number;
  user: User;
}> = ({ surveyId, user }) => {
  const { loading, error, data } = useQuery<{ survey: { descriptiveName: string; questions: QuestionWithAnswer[] } }>(
    SURVEY_ANSWERS,
    {
      variables: { surveyId: surveyId, userId: parseInt(user.id) },
    }
  );
  if (error) return <p>Error...</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <>
          <Typography variant="h3">{data.survey.descriptiveName}</Typography>
          <Typography>
            <b>Søker:</b> {user.firstName} {user.lastName}
          </Typography>
          {data.survey.questions.map((question) => (
            <>
              <Typography>
                <b>{question.question}</b>
              </Typography>
              <Typography>{question.answer.answer}</Typography>
            </>
          ))}
        </>
      )}
    </>
  );
};

export default SurveyAnswers;
