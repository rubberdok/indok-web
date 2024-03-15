"use client";

import { useSuspenseQuery } from "@apollo/client";
import { Settings } from "@mui/icons-material";
import { Box, Container, IconButton, Stack, Tab, Tabs } from "@mui/material";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import React from "react";

import { NextLinkComposed } from "@/app/components/Link";
import { Title } from "@/components";
import { graphql } from "@/gql/app";
import { HEADER_MOBILE_HEIGHT } from "@/lib/mui/theme/constants";

export default function Page({ params, children }: React.PropsWithChildren<{ params: { organizationId: string } }>) {
  const { organizationId } = params;
  const router = useRouter();
  const activeTab = useSelectedLayoutSegment();

  const { data } = useSuspenseQuery(
    graphql(`
      query OrganizationPageLayout($organizationId: ID!) {
        organization(data: { id: $organizationId }) {
          organization {
            id
            name
            logo {
              id
              url
            }
          }
        }
      }
    `),
    { variables: { organizationId } }
  );

  const { organization } = data.organization;

  return (
    <>
      <Title
        sx={{ marginTop: { xs: `-${HEADER_MOBILE_HEIGHT}px`, md: `-${HEADER_MOBILE_HEIGHT}px` } }}
        variant="dark"
        title={organization.name}
        overline="Administrasjonsside"
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: organization.name, href: `/organizations/${organization.id}/admin` },
        ]}
      >
        <Stack direction="row" justifyContent="space-between">
          <Tabs
            value={activeTab}
            onChange={(_e, value) => router.replace(`/organizations/${organizationId}/admin/${value}`)}
          >
            <Tab label="Arrangementer" value="events" />
            <Tab label="Annonser" value="listings" />
            <Tab label="Medlemmer" value="members" />
          </Tabs>
          <Box>
            <IconButton component={NextLinkComposed} to={`/organizations/${organizationId}/admin/edit`}>
              <Settings />
            </IconButton>
          </Box>
        </Stack>
      </Title>
      <Container>{children}</Container>
    </>
  );
}
