import { NoSsr } from "@mui/material";

import { LandingHero, LandingListings, LandingPromo } from "@/components/landing";
import { LandingSection } from "@/components/landing/LandingSection";
import { NextPageWithLayout } from "@/lib/next";

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

export default IndexPage;
