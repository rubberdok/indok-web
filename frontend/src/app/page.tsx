/** @jsxImportSource react */

import { LandingListings, LandingPromo, LandingSection } from "./_components";
import { LandingHero } from "./_components/LandingHero";

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <LandingSection />
      <LandingListings />
      <LandingPromo />
    </>
  );
}
