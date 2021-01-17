import Layout from "@components/Layout";
import Rules from "@components/pages/cabins/Rules";
import { NextPage } from "next";
import styled from "styled-components";

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

const Container = styled.div`
  margin: auto;
  width: 70%;
  padding: 50px;
`;

export default RulesPage;
