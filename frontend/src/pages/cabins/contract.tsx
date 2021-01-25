import Layout from "@components/Layout";
import Container from "@components/pages/cabins/Container";
import Contract from "@components/pages/cabins/Contract";
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
