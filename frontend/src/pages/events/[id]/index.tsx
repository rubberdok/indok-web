import { useQuery } from "@apollo/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import { Event } from "@/components/pages/events/Event";
import { EventDetailFieldsFragment, EventDetailsDocument } from "@/generated/graphql";
import { Layout } from "@/layouts/Layout";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";
import { NextPageWithLayout } from "@/lib/next";

/** Component for showing the detail page of an event. */
const EventInfo: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ event }) => {
  const { data } = useQuery(EventDetailsDocument, {
    variables: { id: event.id },
  });

  return (
    <>
      <Head>
        <title>{`${event.title} - ${event.organization.name} | Indøk NTNU`}</title>
        <meta name="description" content={event.shortDescription ?? event.description} />
        {event.organization.logoUrl && <meta name="og:image" content={event.organization.logoUrl} />}
      </Head>
      <Event event={data?.event ?? event} />
    </>
  );
};

EventInfo.getLayout = (page) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps<{ event: EventDetailFieldsFragment }> = async (ctx) => {
  const client = await initializeApollo({}, ctx);

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
