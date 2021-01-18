import { useQuery } from "@apollo/client";
import { SURVEY } from "@graphql/surveys/queries";
import { Survey } from "@interfaces/surveys";
import QuestionDetail from "@components/pages/surveys/questionDetail";
import { Title } from "@components/ui/Typography";

const SurveyDetail: React.FC<{ id: string }> = ({ id }) => {
  const { error, loading, data } = useQuery<{ survey: Survey }>(SURVEY, { variables: { ID: Number(id) } });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <>
      {data && (
        <>
          <Title>{data.survey.descriptiveName}</Title>
          {data.survey.questions.map((question) => (
            <QuestionDetail question={question} active={true} />
          ))}
        </>
      )}
    </>
  );
};

export default SurveyDetail;
