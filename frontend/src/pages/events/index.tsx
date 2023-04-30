import { ResultOf } from "@graphql-typed-document-node/core";
import { Container, Tab, Tabs } from "@mui/material";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";

import { AllEvents } from "@/components/pages/events";
import { Title } from "@/components/Title";
import { EventsDocument } from "@/generated/graphql";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";
import { NextPageWithLayout } from "@/lib/next";

const links = [
  { name: "Hjem", href: "/" },
  { name: "Arrangementer", href: "/events" },
];

/** Component for showing the list page for event (for showing all events). */
const Events: NextPageWithLayout = () => {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <>
      <Head>
        <title>
          Arrangementer | Indøk NTNU - Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse
        </title>
        <meta name="description" content="Arrangementer på Industriell Økonomi og Teknologiledelse." />
      </Head>
      <Title title="Arrangementer" breadcrumbs={links}>
        <Tabs
          value={view}
          onChange={(_, value: "list" | "calendar") => setView(value)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Liste" value="list" />
          <Tab label="Kalender" value="calendar" />
        </Tabs>
      </Title>
      <Container>
        {view === "list" && <AllEvents />}
        {view === "calendar" && (
          <iframe
            src="https://calendar.google.com/calendar/embed?src=sp3rre4hhjfofj8124jp5k093o%40group.calendar.google.com&ctz=Europe%2FOslo"
            style={{ border: 0 }}
            width="800"
            height="600"
            frameBorder="0"
            scrolling="no"
            title="indok-kalenderen"
          />
        )}
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ResultOf<typeof EventsDocument>> = async (ctx) => {
  const client = initializeApollo({}, ctx);

  const { error, data } = await client.query({
    query: EventsDocument,
  });

  if (error) throw new Error(error.message);

  return addApolloState(client, {
    props: {
      ...data,
    },
  });
};

export default Events;
