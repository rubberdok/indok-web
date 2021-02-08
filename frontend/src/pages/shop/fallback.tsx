import Layout from "@components/Layout";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";

const FallbackPage: NextPage = () => {
  return (
    <Layout>
      <Container>
        <Typography variant="h1">Betaling fullført!</Typography>
        <Typography variant="body1">YAYYYYYY</Typography>
      </Container>
    </Layout>
  );
};

export default FallbackPage;
