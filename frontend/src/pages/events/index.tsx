import Layout from "@components/Layout";
import { Container, Typography, makeStyles } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";
import AllEvents from "../../components/pages/events/AllEvents/index";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
}));

/**
 * Component for showing the list page for event (for showing all events)
 */

const Events: NextPage = () => {
  const classes = useStyles();

  return (
    <Layout>
      <Container>
        <Container className={classes.container}>
          <Typography variant="h1">Arrangementer</Typography>
        </Container>
        <AllEvents />
      </Container>
    </Layout>
  );
};

export default Events;
