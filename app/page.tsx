import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { DemoFrame } from "@/components/landing/DemoFrame";
import { FeatureStrip, HowItWorks } from "@/components/landing/FeatureFeatures";
import { FeatureDeepDive } from "@/components/landing/FeatureDeepDive";
import { StatsSection, LandingFooter } from "@/components/landing/LandingFooter";
import { AuthModal } from "@/components/shared/AuthModal";

export default function LandingPage() {
  return (
    <main className="relative bg-bg-base min-h-screen">
      <LandingNav />
      <HeroSection />
      <FeatureStrip />
      <DemoFrame />
      <HowItWorks />
      <FeatureDeepDive />
      <StatsSection />
      <LandingFooter />
      
      {/* Global Auth Modal Overlay */}
      <AuthModal />
    </main>
  );
}
