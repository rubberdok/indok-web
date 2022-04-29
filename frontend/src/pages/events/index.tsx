import Breadcrumbs from "@components/Breadcrumbs";
import AllEvents from "@components/pages/events/AllEvents";
import { Box, Container, styled, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import Layout from "src/layouts";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";
import { NextPageWithLayout } from "../_app";

/**
 * Component for showing the list page for event (for showing all events)
 */

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

const Events: NextPageWithLayout = () => {
  const [showCalendarView, setShowCalenderView] = useState(false);

  return (
    <RootStyle>
      <Box width={1} pt={5} position="relative" bgcolor="background.neutral">
        <Container>
          <Breadcrumbs sx={{ mb: { xs: 5, md: 8 } }} links={[{ name: "Hjem", href: "/" }, { name: "Arrangementer" }]} />
          <Typography variant="h1" mb={4}>
            Arrangementer
          </Typography>
          <Tabs
            value={showCalendarView ? 1 : 0}
            onChange={() => setShowCalenderView(!showCalendarView)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Liste" />
            <Tab label="Kalender" />
          </Tabs>
        </Container>
      </Box>
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
    </RootStyle>
  );
};

Events.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Events;
