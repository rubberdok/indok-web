import Layout from "@components/Layout";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";

const AboutPage: NextPage = () => {
  return (
    <Layout>
      <Container>
        <Typography variant="h1">Om foreningen</Typography>
        <Typography variant="h2">Fredrik lærer seg progging atm :D</Typography>
        <Typography variant="h3">Les mer her</Typography>
        <Typography variant="body1">
          Velkommen til den offisielle nettsiden for Foreningen for studentene ved Indøk! Siden er laget av og for
          studentene selv. Her kan man lære mer om Indøk, vår historie, studentfrivilligheten og alle sosiale
          begivenheter.
        </Typography>
      </Container>
    </Layout>
  );
};

export default AboutPage;
