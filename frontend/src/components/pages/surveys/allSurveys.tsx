import { useQuery } from "@apollo/client";
import { Survey } from "@interfaces/surveys";
import { SURVEYS } from "@graphql/surveys/queries";

//TODO: remove userID once user log-in is properly implemented
const AllSurveys: React.FC = () => {
  const { loading, error, data } = useQuery<{ surveys: Survey[] }>(SURVEYS);
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <ul>
          {data.surveys.map((survey) => (
            <li key={survey.id}>{survey.descriptiveName}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default AllSurveys;
