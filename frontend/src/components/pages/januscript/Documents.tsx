import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";

import { ArchiveByTypesDocument } from "@/generated/graphql";

import { DocumentList } from "./DocumentList";

type Props = {
  documentTypes: string[];
  year: number | null;
};

export const Documents: React.FC<Props> = ({ documentTypes, year }) => {
  const { refetch, loading, data, error } = useQuery(ArchiveByTypesDocument, {
    variables: { documentTypes, year },
    ssr: false,
  });

  useEffect(() => {
    refetch({ documentTypes, year });
  }, [documentTypes, year, refetch]);

  if (loading) return <p style={{ textAlign: "center" }}></p>;

  if (error) return <p style={{ textAlign: "center" }}> Feil: {error.message} </p>;

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        {year}
      </Typography>
      <DocumentList documents={data?.archiveByTypes} />
    </Box>
  );
};
