import { NoSsr } from "@mui/material";
import React from "react";

import { LandingHero, LandingListings, LandingPromo } from "@/components/landing";
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
        <LandingPromo />
      </NoSsr>
    </>
  );
};

IndexPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default IndexPage;
