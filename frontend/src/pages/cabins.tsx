import Layout from "@components/Layout";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";

const CabinsPage: NextPage = () => {
  return (
    <Layout>
      <Container>
        <Typography variant="h1">Hyttebooking</Typography>
        <Typography variant="body1">Dette er siden for hyttebooking! Den er for øyeblikket under utvikling!</Typography>
      </Container>
    </Layout>
  );
};

export default CabinsPage;
