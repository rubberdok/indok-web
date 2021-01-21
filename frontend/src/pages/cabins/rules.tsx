import Layout from "@components/Layout";
import Container from "@components/pages/cabins/Container";
import Rules from "@components/pages/cabins/Rules";
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
