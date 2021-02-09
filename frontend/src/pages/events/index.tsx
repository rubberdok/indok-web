import Layout from "@components/Layout";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";
import AllEvents from "../../components/pages/events/AllEvents/index";

const Events: NextPage = () => {
  return (
    <Layout>
      <Container>
        <Typography variant="h1">Arrangementer</Typography>
        <AllEvents />
      </Container>
    </Layout>
  );
};

export default Events;
