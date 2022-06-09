import { useQuery } from "@apollo/client";
import { ArchiveByTypesDocument } from "@generated/graphql";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import DocumentList from "./DocumentList";

type Props = {
  documentTypes: string[];
  year: number | null;
  names: string;
};

const Documents: React.FC<Props> = ({ documentTypes, year, names }) => {
  const { refetch, loading, data, error } = useQuery(ArchiveByTypesDocument, {
    variables: { documentTypes, year, names },
  });

  useEffect(() => {
    refetch({ documentTypes, year });
  }, [documentTypes, year, refetch]);

  if (loading) return <p style={{ textAlign: "center" }}></p>;

  if (error) return <p style={{ textAlign: "center" }}> Feil: {error.message} </p>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Alle dokumenter
      </Typography>
      <DocumentList documents={data?.archiveByTypes} />
    </>
  );
};

export default Documents;