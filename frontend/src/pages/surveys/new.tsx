import { NextPage } from "next";
import Layout from "@components/Layout";
import Content from "@components/ui/Content";
import { Title, Paragraph } from "@components/ui/Typography";

const NewPage: NextPage = () => 
  <Layout>
  <Content>
    <Title>Lag ny undersøkelse</Title>
    <Paragraph>Denne siden er under utvilking!</Paragraph> 
  </Content>
  </Layout>
;

export default NewPage