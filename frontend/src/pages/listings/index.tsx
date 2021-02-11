import { NextPage } from "next";
import Layout from "@components/Layout";
import AllListings from "@components/pages/listings/allListings";
import { Card, Button, CardContent, Container, Grid, makeStyles, Typography } from "@material-ui/core";

const IndexPage: NextPage = () => (
  <Layout>
    <Container>
      <AllListings />
    </Container>
  </Layout>
);
export default IndexPage;
