import { NextPage } from "next";
import Layout from "@components/Layout";
import AllListings from "@components/pages/listings/allListings";

const IndexPage: NextPage = () => (
  <Layout>
    <h3>Åpne verv</h3>
    <AllListings />
  </Layout>
);
export default IndexPage;
