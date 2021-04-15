import Layout from "@components/Layout";
import EventCreator from "@components/pages/events/EventCreator";
import { Button, Container, makeStyles } from "@material-ui/core";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const CreateEventsPage: NextPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <Container className={classes.container}>
        <Link href="/events">
          <Button color="primary">Tilbake til arrangementer</Button>
        </Link>
        <EventCreator />
      </Container>
    </Layout>
  );
};

export default CreateEventsPage;
