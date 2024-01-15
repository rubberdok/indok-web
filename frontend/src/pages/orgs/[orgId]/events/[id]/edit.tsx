import { Container } from "@mui/material";
import { useRouter } from "next/router";

import { EditEvent } from "@/components/pages/events";
import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const EditEventPage: NextPageWithLayout = () => {
  const { id, orgId } = useRouter().query;

  const router = useRouter();

  function onCompleted() {
    router.push(`/orgs/${orgId}/events/${id}`);
  }

  if (id && typeof id === "string") {
    return (
      <Container>
        <EditEvent id={id} onCompleted={onCompleted} />
      </Container>
    )
  }
  return null;
};

EditEventPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default EditEventPage;
