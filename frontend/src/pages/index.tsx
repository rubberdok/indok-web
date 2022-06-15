import { LandingHero, LandingListings, LandingPromo } from "@components/landing";
import LandingSection from "@components/landing/LandingSection";
import Layout from "@layouts/Layout";
import React from "react";
import { NextPageWithLayout } from "@layouts/Layout";

const IndexPage: NextPageWithLayout = () => {
  return (
    <>
      <LandingHero />
      <LandingSection />
      <LandingListings />
      <LandingPromo />
    </>
  );
};

IndexPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default IndexPage;
