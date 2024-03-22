import { Title } from "@/components/Title";
import { graphql } from "@/gql/app";
import { getClient } from "@/lib/apollo/ApolloClient";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "@/lib/mui/theme/constants";
import { Container } from "@mui/material";
import { Metadata } from "next";
import React from "react";

const OrganizationDocument = graphql(`
  query AboutUsOrganizationLayout($data: OrganizationInput!) {
    organization(data: $data) {
      organization {
        id
        name
        description
        logo {
          id
          url
        }
      }
    }
  }
`);

export const generateMetadata = async ({ params }: { params: { organizationId: string } }): Promise<Metadata> => {
  const client = getClient();

  const { data } = await client.query({
    query: OrganizationDocument,
    variables: {
      data: {
        id: params.organizationId,
      },
    },
  });
  const images: string[] = [];
  if (data.organization.organization.logo?.url) {
    images.push(data.organization.organization.logo.url);
  }

  return {
    title: data.organization.organization.name,
    description: data.organization.organization.description,
    openGraph: {
      images,
    },
  };
};

export default async function Layout({
  children,
  params,
}: React.PropsWithChildren<{ params: { organizationId: string } }>) {
  const client = getClient();

  const { data } = await client.query({
    query: OrganizationDocument,
    variables: {
      data: {
        id: params.organizationId,
      },
    },
  });
  const { organization } = data.organization;

  return (
    <>
      <Title
        title={organization.name}
        sx={{ mt: { xs: `-${HEADER_MOBILE_HEIGHT}px`, md: `-${HEADER_DESKTOP_HEIGHT}px` } }}
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "Om oss", href: "/about" },
          { name: "Foreninger", href: "/about/organizations" },
          {
            name: organization.name,
            href: `/about/organizations/${organization.id}`,
          },
        ]}
      />
      <Container>{children}</Container>
    </>
  );
}
