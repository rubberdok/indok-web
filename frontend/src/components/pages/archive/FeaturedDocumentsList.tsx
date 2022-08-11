import { useQuery } from "@apollo/client";
import { FeaturedArchiveDocument } from "@generated/graphql-deprecated";
import Typography from "@mui/material/Typography";
import DocumentList from "./DocumentList";

const FeaturedDocumentsList: React.FC = () => {
  const { loading, data, error } = useQuery(FeaturedArchiveDocument);

  if (loading) return <p style={{ textAlign: "center" }}></p>;

  if (error) return <p style={{ textAlign: "center" }}> Feil: {error.message} </p>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Fremhevede dokumenter
      </Typography>
      <DocumentList documents={data?.featuredArchive} />
    </>
  );
};

export default FeaturedDocumentsList;
