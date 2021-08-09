import Layout from "@components/Layout";
import AllEvents from "@components/pages/events/AllEvents";
import { Box, Container, makeStyles, Tab, Tabs, Typography, useTheme } from "@material-ui/core";
import { NextPage } from "next";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
  },
}));

/**
 * Component for showing the list page for event (for showing all events)
 */

const Events: NextPage = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [showCalendarView, setShowCalenderView] = useState(false);

  return (
    <Layout title="Arrangementer">
      <Box width="100%" pt={10} bgcolor={theme.palette.background.paper}>
        <Container>
          <Typography variant="h1" gutterBottom>
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
      <Container className={classes.container}>
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
    </Layout>
  );
};

export default Events;
