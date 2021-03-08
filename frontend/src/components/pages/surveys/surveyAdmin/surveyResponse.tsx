import { User } from "@interfaces/users";
import { SURVEY_RESPONSE } from "@graphql/surveys/queries";
import { useQuery } from "@apollo/client";
import { Question, Answer, Survey } from "@interfaces/surveys";

type QuestionWithAnswer = Question & {
  answer: Answer;
};

const SurveyResponse: React.FC<{
  survey: Survey;
  user: User;
}> = ({ survey, user }) => {
  const { loading, error, data } = useQuery<{ survey: { questions: QuestionWithAnswer[] } }>(SURVEY_RESPONSE, {
    variables: { surveyId: parseInt(survey.id), userId: parseInt(user.id) },
  });
  if (error) return <p>Error...</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data &&
        data.survey.questions.map((question) => (
          <>
            <p>{question.question}</p>
            <p>{question.answer}</p>
          </>
        ))}
    </>
  );
};

export default SurveyResponse;
