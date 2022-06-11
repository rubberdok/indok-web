import { LandingAnnouncement, LandingHero, LandingListings } from "@components/landing";
import Layout from "@components/Layout";
import { NextPage } from "next";
import React from "react";

const IndexPage: NextPage = () => {
  return (
    <Layout>
      <LandingHero />
      <LandingAnnouncement />
      <LandingListings />
    </Layout>
  );
};

export default IndexPage;
