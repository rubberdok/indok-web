import { NextPage } from "next";
import Layout from "@components/Layout";
import React from "react";
import DocumentListView from "@components/pages/archive/documentListView";
import { redirectIfNotLoggedIn } from "src/utils/redirect";

const Archive: NextPage = () => {
  if (redirectIfNotLoggedIn()) {
    return null;
  }
  return (
    <Layout>
      <div>
        <DocumentListView />
      </div>
    </Layout>
  );
};

export default Archive;
