import { graphql } from "@/gql/app";
import { getClient } from "@/lib/apollo/ApolloClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: {
    default: "Dokumenter",
    template: "%s | Indøk NTNU",
  },
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

  return <>{children}</>;
}
