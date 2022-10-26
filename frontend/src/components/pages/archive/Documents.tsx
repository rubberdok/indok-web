import { useQuery } from "@apollo/client";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";

import { ArchiveByTypesDocument } from "@/generated/graphql";

import { DocumentList } from "./DocumentList";

type Props = {
  documentTypes: string[];
  year: number | null;
  names: string;
};

export const Documents: React.FC<React.PropsWithChildren<Props>> = ({ documentTypes, year, names }) => {
  const { refetch, loading, data, error } = useQuery(ArchiveByTypesDocument, {
    variables: { documentTypes, year, names },
    ssr: false,
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
