import Layout from "@components/Layout";
import EventCreator from "@components/pages/events/EventCreator";
import { Button, Container } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
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
        <EventCreator />
      </Container>
    </Layout>
  );
};

export default CreateEventsPage;
