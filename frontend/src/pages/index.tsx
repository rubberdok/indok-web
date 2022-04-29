import { LandingHero, LandingListings } from "@components/landing";
import LandingSection from "@components/landing/LandingSection";
import React from "react";
import Layout from "src/layouts";
import { NextPageWithLayout } from "./_app";

const IndexPage: NextPageWithLayout = () => {
  return (
    <>
      <LandingHero />
      <LandingSection />
      <LandingListings />
    </>
  );
};

IndexPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default IndexPage;
