"use client";

import {
  Navigation,
  FeaturesSection,
  UserTypesSection,
  Footer,
} from "./components";
import HeroCarousel from "@/components/HeroCarousel";
import PromoSection from "./components/PromoSection";

export default function LandingPageView() {
  return (
    <div className="min-h-screen">
      {/* <Navigation /> */}
      <HeroCarousel />
      <PromoSection />
      <FeaturesSection />
      <UserTypesSection />
      {/* <Footer /> */}
    </div>
  );
}
