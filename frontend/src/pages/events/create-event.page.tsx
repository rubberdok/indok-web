import { Button, Container } from "@mui/material";
import Link from "next/link";

import { CreateEvent } from "@/components/pages/events/CreateEvent";
import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

/** Component for showing the create event page. */
const CreateEventsPage: NextPageWithLayout = () => {
  return (
    <Container>
      <Link href="/events" passHref>
        <Button color="primary">Tilbake til arrangementer</Button>
      </Link>
      <CreateEvent />
    </Container>
  );
};

CreateEventsPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default CreateEventsPage;
