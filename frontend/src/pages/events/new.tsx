import { useQuery } from "@apollo/client";
import { Button, Container } from "@mui/material";
import Link from "next/link";

import { CreateEvent } from "@/components/pages/events/Create";
import { UserOrganizationsDocument } from "@/generated/graphql";
import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";

/** Component for showing the create event page. */
const NewEventPage: NextPageWithLayout = () => {
  const { data } = useQuery(UserOrganizationsDocument);
  const organizations = data?.user?.organizations ?? [];
  return (
    <Container>
      <Link href="/events" passHref>
        <Button color="primary">Tilbake til arrangementer</Button>
      </Link>
      <CreateEvent organizations={organizations} />
    </Container>
  );
};

NewEventPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default NewEventPage;
