import Layout from "@components/Layout";
import AllEvents from "@components/pages/events/allEvents";
import CreateEvent from "@components/pages/events/createEvent";
import { NextPage } from "next";
import React from "react";
import styled from "styled-components";

const EventPage: NextPage = () => {
  return (
    <Layout>
      <Col>
        <h1>Events</h1>
        <CreateEvent />
        <AllEvents />
      </Col>
    </Layout>
  );
};

export default EventPage;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;
