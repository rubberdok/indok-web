import { NextPage } from "next";
import NewListing from "@components/pages/listings/organization/NewListing";
import Layout from "@components/Layout";
import { Container } from "@material-ui/core";

/**
 * @description Page for creating new listings, navigates to the newly created listing upon completion
 */
const NewListingPage: NextPage = () => (
  <Layout>
    <Container>
      <NewListing />
    </Container>
  </Layout>
);

export default NewListingPage;
