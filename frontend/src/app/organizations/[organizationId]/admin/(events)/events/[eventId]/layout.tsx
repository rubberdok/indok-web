"use client";
import { useSuspenseQuery } from "@apollo/client";
import { Container, Tab, Tabs } from "@mui/material";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";

import { Title } from "@/components";
import { graphql } from "@/gql/app";
import { HEADER_MOBILE_HEIGHT } from "@/lib/mui/theme/constants";

const segments: { "sign-ups": string; about: string; [key: string]: string } = {
  "sign-ups": "Påmeldinger",
  about: "Detaljer",
} as const;

export default function Layout({
  params,
  children,
}: React.PropsWithChildren<{ params: { eventId: string; organizationId: string } }>) {
  const { eventId, organizationId } = params;
  const segment = useSelectedLayoutSegment() ?? "about";
  const router = useRouter();

  const { data } = useSuspenseQuery(
    graphql(`
      query EventAdminLayout_Event($data: EventInput!) {
        event(data: $data) {
          event {
            id
            name
            organization {
              id
              name
            }
          }
        }
      }
    `),
    { variables: { data: { id: eventId } } }
  );

  return (
    <>
      <Title
        variant="dark"
        title={data.event.event.name}
        overline={data.event.event.organization?.name}
        sx={{ marginTop: { xs: `-${HEADER_MOBILE_HEIGHT}px`, md: `-${HEADER_MOBILE_HEIGHT}px` } }}
        breadcrumbs={[
          { href: "/", name: "Hjem" },
          { href: `/organizations/${organizationId}/admin`, name: data.event.event.organization?.name ?? "" },
          { href: `/organizations/${organizationId}/admin/events/${eventId}`, name: data.event.event.name },
          {
            href: `/organizations/${organizationId}/admin/events/${eventId}/${segment}`,
            name: segments[segment],
          },
        ]}
      >
        <Tabs
          value={segment}
          onChange={(_e, value: "about" | "sign-ups") =>
            router.push(`/organizations/${organizationId}/admin/events/${eventId}/${value}`)
          }
        >
          <Tab label={segments.about} value="about" />
          <Tab label={segments["sign-ups"]} value="sign-ups" />
        </Tabs>
      </Title>
      <Container>{children}</Container>
    </>
  );
}
