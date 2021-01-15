import Layout from "@components/Layout";
import AllEvents from "@components/pages/events/allEvents";
import CreateEvent from "@components/pages/events/createEvent";
import Content from "@components/ui/Content";
import { Title } from "@components/ui/Typography";
import { NextPage } from "next";
import React from "react";

const EventPage: NextPage = () => {
  return (
    <Layout>
      <Content>
        <Title>Events</Title>
        <CreateEvent />
        <AllEvents />
      </Content>
    </Layout>
  );
};

export default EventPage;
