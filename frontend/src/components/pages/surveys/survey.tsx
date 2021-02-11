import { useQuery } from "@apollo/client";
import { SURVEY } from "@graphql/surveys/queries";
import { Survey } from "@interfaces/surveys";

const SurveyDetail: React.FC<{ id: string }> = ({ id }) => {
  const { error, loading, data } = useQuery<{ survey: Survey }>(SURVEY, { variables: { ID: Number(id) } });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <>
      {data && (
        <>
          <h3>{data.survey.descriptiveName}</h3>
          {data.survey.questions.map((question) => (
            <></>
          ))}
        </>
      )}
    </>
  );
};

export default SurveyDetail;
