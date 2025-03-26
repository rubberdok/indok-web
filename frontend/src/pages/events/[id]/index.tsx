import { useQuery } from "@apollo/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import React from "react";

import { EventDetail } from "@/components/pages/events";
import { EventDetailFieldsFragment, EventDetailsDocument } from "@/generated/graphql";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";
import { NextPageWithLayout } from "@/lib/next";

interface User {
  id: string;
  gradeYear?: number | null;
  organizations: Array<{
    __typename?: "OrganizationType";
    id: string;
  }>;
}

export const UserContext = React.createContext<User | null>(null);

/** Component for showing the detail page of an event. */
const EventInfo: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ event }) => {
  const { data } = useQuery(EventDetailsDocument, {
    variables: { id: event.id },
    pollInterval: 60 * 1000,
  });

  return (
    <>
      <Head>
        <title>{`${event.title} - ${event.organization.name} | Indøk NTNU`}</title>
        <meta name="description" content={event.shortDescription ?? event.description} />
        {event.organization.logoUrl && <meta name="og:image" content={event.organization.logoUrl} />}
      </Head>
      <UserContext.Provider value={data?.user ?? null}>
        <EventDetail event={data?.event ?? event} />
      </UserContext.Provider>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{ event: EventDetailFieldsFragment }> = async (ctx) => {
  const client = initializeApollo({}, ctx);

  const id = ctx.params?.id;
  if (typeof id !== "string") {
    return {
      notFound: true,
    };
  }

  const { data, error } = await client.query({
    query: EventDetailsDocument,
    variables: {
      id,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const event = data.event;

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
