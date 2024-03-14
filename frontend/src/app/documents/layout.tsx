import { Title } from "@/components/Title";
import { graphql } from "@/gql/app";
import { FeaturePermission } from "@/gql/app/graphql";
import { getClient } from "@/lib/apollo/ApolloClient";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "@/lib/mui/theme/constants";
import { Container } from "@mui/material";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dokumenter",
};

export default async function Layout({ children }: React.PropsWithChildren) {
  const client = getClient();

  const { data } = await client.query({
    query: graphql(`
      query DocumentsLayout_HasFeaturePermission($data: HasFeaturePermissionInput!) {
        hasFeaturePermission(data: $data) {
          id
          hasFeaturePermission
        }
      }
    `),
    variables: {
      data: {
        featurePermission: FeaturePermission.ArchiveViewDocuments,
      },
    },
  });

  if (!data.hasFeaturePermission.hasFeaturePermission) return redirect("/login");
  return (
    <>
      <Title
        title="Dokumenter"
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "Dokumenter", href: "/documents" },
        ]}
        sx={{ mt: { xs: `-${HEADER_MOBILE_HEIGHT}px`, md: `-${HEADER_DESKTOP_HEIGHT}px` } }}
      />
      <Container>{children}</Container>
    </>
  );
}
