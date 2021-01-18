import Layout from "@components/Layout";
import Content from "@components/ui/Content";
import { Paragraph, Title } from "@components/ui/Typography";
import { NextPage } from "next";
import React from "react";

const AboutPage: NextPage = () => {
  return (
    <Layout>
      <Content>
        <Title>Om foreningen</Title>
        <Paragraph>Dette er siden om foreningen! Den er for øyeblikket under utvikling!</Paragraph>
      </Content>
    </Layout>
  );
};

export default AboutPage;
