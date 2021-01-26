import Layout from "@components/Layout";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";
import AllEvents from "../../components/pages/events/AllEvents/index";

const Events: NextPage = () => {
  return (
    <Layout>
      <Container>
        <div>
          <Typography variant="h1">Arrangementer</Typography>
        </div>

        <div>
          <AllEvents />
        </div>
      </Container>
    </Layout>
  );
};

export default Events;
