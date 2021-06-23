import { NextPage } from "next";
import { Container } from "@material-ui/core";
import Layout from "@components/Layout";

const _404: NextPage = () => {
  return (
    <Layout>
      <Container>
        Her fant vi faktisk absolutt ingenting.
      </Container>
    </Layout>
  )
}

export default _404;