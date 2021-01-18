import { useQuery } from "@apollo/client";
import { Survey } from "@interfaces/surveys";
import { SURVEYS } from "@graphql/surveys/queries";
import Link from "next/link";
import List from "@components/ui/list";
import ListItem from "@components/ui/listItem";

//TODO: remove userID once user log-in is properly implemented
const AllSurveys: React.FC = () => {
  const { loading, error, data } = useQuery<{ surveys: Survey[] }>(SURVEYS);
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <List>
          {data.surveys.map((survey) => (
            <ListItem key={survey.id} mainText={survey.descriptiveName} subText={"tomt"} selected={false}/>
/*
            <Link href={`/users/${userID}/listings/${listing.id}/${listing.slug}`}>{listing.title}</Link>
            <p>
              {listing.organization && (
                <>
                  {listing.organization.name}
                  <br />
                </>
              )}
              Frist: {listing.deadline.slice(0, 16).replace("T", " ")}
            </p>
*/
          ))}
        </List>
      )}
    </>
  );
};

export default AllSurveys;
