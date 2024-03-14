import { graphql } from "@/gql/app";
import { FeaturePermission } from "@/gql/app/graphql";
import { getClient } from "@/lib/apollo/ApolloClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | Administrer hytter",
    default: "Administrer hytter",
  },
};

export default async function Layout({ children }: React.PropsWithChildren) {
  const client = getClient();
  const { data } = await client.query({
    query: graphql(`
      query CabinsAdminLayout_HasFeaturePermission($data: HasFeaturePermissionInput!) {
        hasFeaturePermission(data: $data) {
          hasFeaturePermission
        }
      }
    `),
    variables: {
      data: {
        featurePermission: FeaturePermission.CabinAdmin,
      },
    },
  });

  if (!data.hasFeaturePermission.hasFeaturePermission) return notFound();
  return <>{children}</>;
}
