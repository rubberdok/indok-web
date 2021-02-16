import Layout from "@components/Layout";
import Rules from "@components/pages/cabins/Documents/Rules";
import { Container } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";

const RulesPage: NextPage = () => {
  return (
    <>
      <Layout>
        <Container>
          <Rules></Rules>
        </Container>
      </Layout>
    </>
  );
};

export default RulesPage;
