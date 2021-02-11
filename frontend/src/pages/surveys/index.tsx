import { NextPage } from "next";
import Layout from "@components/Layout";
import {
  Container,
  Button,
  Typography
} from "@material-ui/core";
import AllSurveys from "@components/pages/surveys/allSurveys";
import Link from "next/link";

const IndexPage: NextPage = () => (
  <Layout>
    <Container>
      <Typography variant="h1" component="h1">Stillingsutlysninger</Typography>
      <AllSurveys />
      <Link href="surveys/new">
        <Button>Lag ny stillingsutlysning</Button>
      </Link>
    </Container>
  </Layout>
);
export default IndexPage;
