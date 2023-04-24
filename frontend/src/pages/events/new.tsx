import { useQuery } from "@apollo/client";
import { Button, Container } from "@mui/material";

import { Link } from "@/components";
import { CreateEvent } from "@/components/pages/events/Create";
import { UserOrganizationsDocument } from "@/generated/graphql";
import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

/** Component for showing the create event page. */
const NewEventPage: NextPageWithLayout = () => {
  const { data } = useQuery(UserOrganizationsDocument);
  const organizations = data?.user?.organizations ?? [];
  return (
    <Container>
      <Button component={Link} href="/events" noLinkStyle color="primary">
        Tilbake til arrangementer
      </Button>
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
