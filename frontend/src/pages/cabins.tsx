import Layout from "@components/Layout";
import Content from "@components/ui/Content";
import { Paragraph, Title } from "@components/ui/Typography";
import { NextPage } from "next";
import React from "react";

const CabinsPage: NextPage = () => {
  return (
    <Layout>
      <Content>
        <Title>Hyttebooking</Title>
        <Paragraph>Dette er siden for hyttebooking! Den er for øyeblikket under utvikling!</Paragraph>
      </Content>
    </Layout>
  );
};

export default CabinsPage;
