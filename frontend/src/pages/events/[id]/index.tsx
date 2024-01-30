import { useQuery } from "@apollo/client";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import { EventDetail } from "@/components/pages/events";
import { graphql } from "@/gql/pages";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";
import { NextPageWithLayout } from "@/lib/next";

const EventDocument = graphql(`
  query EventPage($data: EventInput!) {
    event(data: $data) {
      event {
        id
        name
        description
        organization {
          id
          name
        }
        ...EventDetailFields
      }
    }
    ...UserOrganizationQuery
  }
`);

/** Component for showing the detail page of an event. */
const EventInfo: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ event }) => {
  const { data } = useQuery(EventDocument, {
    variables: { data: { id: event.id } },
    pollInterval: 60 * 1000,
  });

  return (
    <>
      <Head>
        <title>{`${event.name} - ${event.organization?.name} | Indøk NTNU`}</title>
        <meta name="description" content={event.description} />
      </Head>
      {data && <EventDetail event={data.event.event} organizations={data} />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  event: ResultOf<typeof EventDocument>["event"]["event"];
}> = async (ctx) => {
  const client = initializeApollo({}, ctx);

  const id = ctx.params?.id;
  if (typeof id !== "string") {
    return {
      notFound: true,
    };
  }

  const { data, error } = await client.query({
    query: EventDocument,
    variables: {
      data: { id },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const { event } = data.event;

  if (!event) {
    return {
      notFound: true,
    };
  }

  return addApolloState(client, {
    props: {
      event,
    },
  });
};

export default EventInfo;
