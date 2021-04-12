import Layout from "@components/Layout";
import DocumentListView from "@components/pages/archive/documentListView";
import { Container, makeStyles } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";
import { redirectIfNotLoggedIn } from "src/utils/redirect";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
}));

const Archive: NextPage = () => {
  if (redirectIfNotLoggedIn()) {
    return null;
  }
  const classes = useStyles();

  return (
    <Layout>
      <Container className={classes.container}>
        <DocumentListView />
      </Container>
    </Layout>
  );
};

export default Archive;
