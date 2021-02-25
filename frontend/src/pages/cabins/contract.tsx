import Layout from "@components/Layout";
import Contract from "@components/pages/cabins/Documents/Contract";
import { Container } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";

const ContractPage: NextPage = () => {
  return (
    <>
      <Layout>
        <Container>
          <Contract></Contract>
        </Container>
      </Layout>
    </>
  );
};

export default ContractPage;
