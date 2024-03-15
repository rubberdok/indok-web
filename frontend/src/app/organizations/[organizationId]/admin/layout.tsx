import { Metadata } from "next";
import { notFound } from "next/navigation";

import { graphql } from "@/gql/app";
import { getClient } from "@/lib/apollo/ApolloClient";

export const generateMetadata = async ({ params }: { params: { organizationId: string } }): Promise<Metadata> => {
  const { organizationId } = params;
  const client = getClient();

  const { data } = await client.query({
    query: graphql(`
      query OrganizationLayout_Organization($organizationId: ID!) {
        organization(data: { id: $organizationId }) {
          organization {
            id
            name
          }
        }
        hasRole(data: { organizationId: $organizationId, role: MEMBER }) {
          hasRole
        }
      }
    `),
    variables: { organizationId },
  });

  const { organization, hasRole } = data;
  if (!hasRole.hasRole) return notFound();
  return {
    title: organization.organization.name,
  };
};

export default async function Layout({
  params,
  children,
}: React.PropsWithChildren<{ params: { organizationId: string } }>) {
  const { organizationId } = params;
  const client = getClient();

  const { data } = await client.query({
    query: graphql(`
      query OrganizationAdminLayout_HasRole($organizationId: ID!) {
        hasRole(data: { organizationId: $organizationId, role: MEMBER }) {
          hasRole
        }
      }
    `),
    variables: { organizationId },
  });

  const { hasRole: isMember } = data.hasRole;

  if (!isMember) return notFound();
  return <>{children}</>;
}
