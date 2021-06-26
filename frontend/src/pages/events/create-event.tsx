import Layout from "@components/Layout";
import CreateEvent from "@components/pages/events/createEvent";
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

/**
 * Component for showing the create event page
 */

const CreateEventsPage: NextPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <Container className={classes.container}>
        <Link href="/events">
          <Button color="primary">Tilbake til arrangementer</Button>
        </Link>
        <CreateEvent />
      </Container>
    </Layout>
  );
};

export default CreateEventsPage;
