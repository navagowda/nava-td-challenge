import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import FeatureCards from "@/components/landing/FeatureCards";
import RiskFirstSection from "@/components/landing/RiskFirstSection";
import DashboardPreview from "@/components/landing/DashboardPreview";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeatureCards />
      <RiskFirstSection />
      <DashboardPreview />
      <Footer />
    </>
  );
}
