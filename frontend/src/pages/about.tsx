import Layout from "@components/Layout";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";

const AboutPage: NextPage = () => {
  return (
    <Layout>
      <Container>
        <Typography variant="h1">Om foreningen</Typography>
        <Typography variant="body1">Dette er siden om foreningen! Den er for øyeblikket under utvikling!</Typography>
      </Container>
    </Layout>
  );
};

export default AboutPage;
