import { Button, Container, makeStyles } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";
import CreateEvent from "@components/pages/events/createEvent";
import Link from "next/link";
import Layout from "@components/Layout";

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
        <CreateEvent />
      </Container>
    </Layout>
  );
};

export default CreateEventsPage;
