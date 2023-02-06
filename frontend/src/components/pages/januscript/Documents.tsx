import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";

import { AllJanuscriptDocument } from "@/generated/graphql";

import { DocumentList } from "./DocumentList";

type Props = {
  documentTypes: string[];
  year: number | null;
};

export const Documents: React.FC<Props> = ({ documentTypes, year }) => {
  const { loading, data, error } = useQuery(AllJanuscriptDocument);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  if (error) return <p style={{ textAlign: "center" }}> Feil: {error.message} </p>;

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        {year}
      </Typography>
      <DocumentList documents={data?.allJanuscript} />
    </Box>
  );
};
