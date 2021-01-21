import { NextPage } from "next";
import Layout from "@components/Layout";
import Content from "@components/ui/Content";
import { Title } from "@components/ui/Typography";
import Button from "@components/ui/Button";
import AllSurveys from "@components/pages/surveys/allSurveys";
import Link from "next/link";

const IndexPage: NextPage = () => (
  <Layout>
    <Content>
      <Title>Stillingsutlysninger</Title>
      <AllSurveys />
      <Link href="surveys/new">
        <Button>Lag ny stillingsutlysning</Button>
      </Link>
    </Content>
  </Layout>
);
export default IndexPage;
