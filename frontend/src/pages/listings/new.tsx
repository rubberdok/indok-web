import Layout, { RootStyle } from "@components/layouts";
import NewListing from "@components/pages/listings/organization/NewListing";
import { NextPageWithLayout } from "../_app";

/**
 * Page for creating new listings, navigates to the newly created listing upon completion.
 */
const NewListingPage: NextPageWithLayout = () => <NewListing />;

NewListingPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default NewListingPage;
