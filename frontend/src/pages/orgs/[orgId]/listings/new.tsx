import { useRouter } from "next/router";

import NewListing from "@components/pages/listings/organization/NewListing";
import Layout, { RootStyle } from "@layouts/Layout";
import { NextPageWithLayout } from "src/pages/_app";

/**
 * Page for creating new listings, navigates to the newly created listing upon completion.
 */
const NewListingPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { orgId } = router.query;

  return <NewListing defaultOrganizationId={orgId as string} />;
};

NewListingPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default NewListingPage;
