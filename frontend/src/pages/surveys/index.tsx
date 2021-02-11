import Layout from "@components/Layout";
import AllSurveys from "@components/pages/surveys/allSurveys";
import {
  Button, Container,

  Typography
} from "@material-ui/core";
import { NextPage } from "next";
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
