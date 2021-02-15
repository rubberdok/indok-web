import Layout from "@components/Layout";
import Container from "@components/pages/cabins/Container";
import { Typography } from "@material-ui/core";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";

const Confirmation: NextPage = () => {
  return (
    <>
      <Layout>
        <Container>
          <Typography variant="h1">Bekreftelse for booking</Typography>
          <Typography variant="body1">
            Takk for din booking! Denne nettsiden er fortsatt under konstruksjon, så det blir ikke faktisk opprettet en
            booking. Det må du fortsatt gjøre gjennom{" "}
            <Link href="mailto:booking@indokhyttene.no">booking@indokhyttene.no</Link>.
          </Typography>
        </Container>
      </Layout>
    </>
  );
};

export default Confirmation;
