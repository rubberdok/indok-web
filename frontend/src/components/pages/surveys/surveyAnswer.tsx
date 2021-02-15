import { useQuery } from "@apollo/client";
import { SURVEY } from "@graphql/surveys/queries";
import { Survey } from "@interfaces/surveys";
import QuestionAnswer from "@components/pages/surveys/questionAnswer";
import { Typography } from "@material-ui/core";

const SurveyAnswer: React.FC<{ surveyId: string }> = ({ surveyId }) => {
  const { error, loading, data } = useQuery<{ survey: Survey }>(SURVEY, { variables: { ID: Number(surveyId) } });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  return (
    <>
      {data && (
        <>
          <Typography variant="h1" component="h1">
            {data.survey.descriptiveName}
          </Typography>
          {data.survey.questions.map((question) => (
            <li key={question.id}>
              <QuestionAnswer question={question} />
            </li>
          ))}
        </>
      )}
    </>
  );
};

export default SurveyAnswer;
