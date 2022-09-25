import { LandingHero, LandingListings, LandingPromo } from "@components/landing";
import LandingSection from "@components/landing/LandingSection";
import Layout from "@layouts/Layout";
import { NoSsr } from "@mui/material";
import React from "react";
import { NextPageWithLayout } from "./_app";

const IndexPage: NextPageWithLayout = () => {
  return (
    <>
      <LandingHero />
      <LandingSection />
      <NoSsr defer>
        <LandingListings />
        <LandingPromo />
      </NoSsr>
    </>
  );
};

IndexPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default IndexPage;
