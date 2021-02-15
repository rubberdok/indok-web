import { NextPage } from "next";
import Layout from "@components/Layout";
import { Container, Typography } from "@material-ui/core";

const NewPage: NextPage = () => (
  <Layout>
    <Container>
      <Typography variant="h1" component="h1">
        Lag ny undersøkelse
      </Typography>
      <Typography component="p">Denne siden er under utvilking!</Typography>
    </Container>
  </Layout>
);
export default NewPage;
