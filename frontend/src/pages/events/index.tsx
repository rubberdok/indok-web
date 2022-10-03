import { Container, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";

import AllEvents from "@/components/pages/events/AllEvents";
import Title from "@/components/Title";
import Layout from "@/layouts/Layout";

import { NextPageWithLayout } from "../_app";

const links = [{ name: "Hjem", href: "/" }, { name: "Arrangementer" }];

/**
 * Component for showing the list page for event (for showing all events)
 */
const Events: NextPageWithLayout = () => {
  const [showCalendarView, setShowCalenderView] = useState(false);

  return (
    <>
      <Title title="Arrangementer" breadcrumbs={links}>
        <Tabs
          value={showCalendarView ? 1 : 0}
          onChange={() => setShowCalenderView(!showCalendarView)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Liste" />
          <Tab label="Kalender" />
        </Tabs>
      </Title>
      <Container sx={{ mb: 10, mt: 6 }}>
        {showCalendarView ? (
          <iframe
            src="https://calendar.google.com/calendar/embed?src=sp3rre4hhjfofj8124jp5k093o%40group.calendar.google.com&ctz=Europe%2FOslo"
            style={{ border: 0 }}
            width="800"
            height="600"
            frameBorder="0"
            scrolling="no"
            title="indok-kalenderen"
          ></iframe>
        ) : (
          <AllEvents />
        )}
      </Container>
    </>
  );
};

Events.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Events;
