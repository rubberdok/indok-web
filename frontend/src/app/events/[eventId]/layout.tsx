import { Container } from "@mui/material";
import { Metadata } from "next";

import { Title } from "@/components/Title";
import { getFragmentData, graphql } from "@/gql/app";
import { getClient } from "@/lib/apollo/ApolloClient";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "@/lib/mui/theme/constants";

const EventLayoutEventFragment = graphql(`
  fragment EventLayout_Event on Event {
    id
    name
    shortDescription
    organization {
      id
      name
    }
  }
`);

export async function generateMetadata({ params }: { params: { eventId: string } }): Promise<Metadata> {
  const client = getClient();

  const { data } = await client.query({
    query: graphql(`
      query EventLayout_EventQuery($data: EventInput!) {
        event(data: $data) {
          event {
            ...EventLayout_Event
          }
        }
      }
    `),
    variables: { data: { id: params.eventId } },
  });

  const event = getFragmentData(EventLayoutEventFragment, data.event.event);
  const { organization } = event;
  const title = `${event.name} - ${organization?.name}`;
  return {
    title,
    description: event.shortDescription,
  };
}

export default async function Layout({ params, children }: React.PropsWithChildren<{ params: { eventId: string } }>) {
  const client = getClient();
  const { data } = await client.query({
    query: graphql(`
      query EventLayout_EventQuery($data: EventInput!) {
        event(data: $data) {
          event {
            ...EventLayout_Event
          }
        }
      }
    `),
    variables: { data: { id: params.eventId } },
  });
  const event = getFragmentData(EventLayoutEventFragment, data.event.event);
  return (
    <>
      <Title
        title={event.name}
        overline={event.organization?.name}
        sx={{ mt: { xs: `-${HEADER_MOBILE_HEIGHT}px`, md: `-${HEADER_DESKTOP_HEIGHT}px` } }}
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "Arrangementer", href: "/events" },
          { name: event.name, href: `/events/${event.id}` },
        ]}
      />
      <Container>{children}</Container>
    </>
  );
}
