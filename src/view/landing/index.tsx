"use client";

import {
  Navigation,
  HeroSection,
  FeaturesSection,
  UserTypesSection,
  Footer,
} from "./components";

export default function LandingPageView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <UserTypesSection />
      <Footer />
    </div>
  );
}
