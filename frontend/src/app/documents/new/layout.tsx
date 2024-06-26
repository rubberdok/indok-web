import { Container } from "@mui/material";
import type { Metadata } from "next";

import { graphql } from "@/gql/app";
import { getClient } from "@/lib/apollo/ApolloClient";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Nytt dokument",
};

export default async function Layout({ children }: React.PropsWithChildren) {
  const client = getClient();
  const { data } = await client.query({
    query: graphql(`
      query DocumentsNew_Layout {
        hasFeaturePermission(data: { featurePermission: ARCHIVE_WRITE_DOCUMENTS }) {
          id
          hasFeaturePermission
        }
      }
    `),
  });

  if (!data.hasFeaturePermission.hasFeaturePermission) {
    return notFound();
  }

  return <Container maxWidth="sm">{children}</Container>;
}
