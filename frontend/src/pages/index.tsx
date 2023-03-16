import { NoSsr } from "@mui/material";

import { LandingHero, LandingListings } from "@/components/landing";
import { LandingSection } from "@/components/landing/LandingSection";
import { Layout } from "@/layouts/Layout";

import { NextPageWithLayout } from "./_app";

const IndexPage: NextPageWithLayout = () => {
  return (
    <>
      <LandingHero />
      <LandingSection />
      <NoSsr>
        <LandingListings />
      </NoSsr>
    </>
  );
};

IndexPage.getLayout = (page) => <Layout>{page}</Layout>;

export default IndexPage;
