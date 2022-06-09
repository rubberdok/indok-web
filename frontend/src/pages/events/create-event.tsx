import Layout, { RootStyle } from "@layouts/Layout";
import EventCreator from "@components/pages/events/EventCreator";
import { Button, Container } from "@mui/material";
import Link from "next/link";
import React from "react";
import { NextPageWithLayout } from "../_app";

/**
 * Component for showing the create event page
 */

const CreateEventsPage: NextPageWithLayout = () => {
  return (
    <Container>
      <Link href="/events" passHref>
        <Button color="primary">Tilbake til arrangementer</Button>
      </Link>
      <EventCreator />
    </Container>
  );
};

CreateEventsPage.getLayout = (page: React.ReactElement) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default CreateEventsPage;
