import Layout from "@components/Layout";
import { Button, Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import Link from "next/link";

const IndexPage: NextPage = () => (
  <Layout>
    <Container>
      <Typography variant="h1" component="h1">
        Spørreundersøkelser
      </Typography>
      <Link href="surveys/new">
        <Button>Lag ny spørreundersøkelse</Button>
      </Link>
    </Container>
  </Layout>
);
export default IndexPage;
