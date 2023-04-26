import { NoSsr } from "@mui/material";

import { LandingHero, LandingListings, LandingPromo } from "@/components/pages/landing";
import { LandingSection } from "@/components/pages/landing/LandingSection";
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
