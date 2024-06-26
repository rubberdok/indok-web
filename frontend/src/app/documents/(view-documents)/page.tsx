"use client";

import { useQuery, useSuspenseQuery } from "@apollo/client";
import { Unstable_Grid2 as Grid } from "@mui/material";

import { graphql } from "@/gql/app";

import { Document } from "../Document";

const DocumentsPageQuery = graphql(`
  query DocumentsPage_Documents {
    documents {
      documents {
        id
        ...DocumentFragment
      }
    }
  }
`);

export default function Page() {
  const { data } = useSuspenseQuery(DocumentsPageQuery);

  useQuery(DocumentsPageQuery, {
    pollInterval: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <Grid container direction="row" spacing={2} alignItems="stretch" justifyContent="center">
      {data.documents.documents.map((document) => (
        <Grid md={3} xs={12} sm={6} key={document.id}>
          <Document document={document} />
        </Grid>
      ))}
    </Grid>
  );
}
