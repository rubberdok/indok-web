"use client";
import { graphql } from "@/gql/app";
import { useSuspenseQuery } from "@apollo/client";
import { notFound } from "next/navigation";

export default function Layout({ params, children }: React.PropsWithChildren<{ params: { organizationId: string } }>) {
  const { organizationId } = params;

  const { data } = useSuspenseQuery(
    graphql(`
      query OrganizationAdminLayout_HasRole($organizationId: ID!) {
        hasRole(data: { organizationId: $organizationId, role: MEMBER }) {
          hasRole
        }
      }
    `),
    { variables: { organizationId } }
  );

  const { hasRole: isMember } = data.hasRole;

  if (!isMember) return notFound();
  return <>{children}</>;
}
