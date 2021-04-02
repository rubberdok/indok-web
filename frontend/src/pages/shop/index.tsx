import PayWithVipps from "@components/ecommerce/PayWithVipps";
import Layout from "@components/Layout";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";

const ShopPage: NextPage = () => {
  return (
    <Layout>
      <Container>
        <Typography variant="h1">Vipps test</Typography>
        <Typography variant="body1">Test å betale med vipps ved å trykke på knappen!</Typography>
        <PayWithVipps />
      </Container>
    </Layout>
  );
};

export default ShopPage;
