/** @jsxImportSource react */

import { Metadata } from "next";

import { LandingListings, LandingPromo, LandingSection } from "./_components";
import { LandingHero } from "./_components/LandingHero";

export const metadata: Metadata = {
  title: "Indøk NTNU - Foreningen for Industriell Økonomi og teknologiledelse",
  description:
    "Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen for all studentfrivillighet på masterstudiet Indøk ved NTNU. Arrangementer, verv, og oversikt over det sosiale på Indøk.",
  openGraph: {
    images: "img/gang.jpg",
  },
};

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
