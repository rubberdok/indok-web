import Layout from "@components/Layout";
import { Container, makeStyles } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import EventDetailPage from "../../components/pages/events/EventDetails";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
}));

const EventInfo: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const classes = useStyles();

  return (
    <Layout>
      <Container className={classes.container}>
        {id && typeof id === "string" ? <EventDetailPage eventId={id} /> : <></>}
      </Container>
    </Layout>
  );
};

export default EventInfo;
