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
  anniversary: {
    transition: "0.7s all ease",
    background: "url('/static/anniversary/anniversary_logo_black.svg')",
    backgroundSize: "contain",
    backgroundPosition: "center center!important",
    backgroundRepeat: "no-repeat",
    opacity: 0.05,
    height: "120%",
    marginLeft: "-20vh",
    right: 0,
    top: 0,

    [theme.breakpoints.down("sm")]: {
      backgroundPosition: "right center!important",
    },
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
    <Layout>
      <Box width="100%" pt={10} position="relative" overflow="hidden" bgcolor={theme.palette.background.paper}>
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
        <Box className={classes.anniversary} position="absolute" width="100vw" height="100vh"></Box>
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
