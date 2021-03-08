import { User } from "@interfaces/users";
import { SURVEY_ANSWERS } from "@graphql/surveys/queries";
import { useQuery } from "@apollo/client";
import { Question, Answer } from "@interfaces/surveys";

type QuestionWithAnswer = Question & {
  answer: Answer;
};

const SurveyAnswers: React.FC<{
  surveyId: number;
  user: User;
}> = ({ surveyId, user }) => {
  const { loading, error, data } = useQuery<{ survey: { questions: QuestionWithAnswer[] } }>(SURVEY_ANSWERS, {
    variables: { surveyId: surveyId, userId: parseInt(user.id) },
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

export default SurveyAnswers;
