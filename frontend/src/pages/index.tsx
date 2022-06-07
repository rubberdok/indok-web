import { LandingHero, LandingListings } from "@components/landing";
import LandingSection from "@components/landing/LandingSection";
import Layout from "@components/layouts";
import React from "react";
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
