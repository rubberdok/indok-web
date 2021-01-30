import Layout from "@components/Layout";
import DocumentListView from "@components/pages/archive/documentListView";
import { Container } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";
import { redirectIfNotLoggedIn } from "src/utils/redirect";

const Archive: NextPage = () => {
  if (redirectIfNotLoggedIn()) {
    return null;
  }
  return (
    <Layout>
      <Container>
        <DocumentListView />
      </Container>
    </Layout>
  );
};

export default Archive;
