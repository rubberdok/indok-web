import Layout from "@components/Layout";
import Contract from "@components/pages/cabins/Contract";
import { NextPage } from "next";
import styled from "styled-components";

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

const Container = styled.div`
  margin: auto;
  width: 70%;
  padding: 50px;
`;

export default ContractPage;
