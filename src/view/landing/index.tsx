"use client";

import {
  Navigation,
  FeaturesSection,
  UserTypesSection,
  Footer,
} from "./components";
import HeroCarousel from "@/components/HeroCarousel";

export default function LandingPageView() {
  return (
    <div className="min-h-screen">
      {/* <Navigation /> */}
      <HeroCarousel />
      <FeaturesSection />
      <UserTypesSection />
      {/* <Footer /> */}
    </div>
  );
}
