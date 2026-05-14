import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection, Footer } from "@/components/landing/CTAFooter";

export const metadata: Metadata = {
  title: "EduTrack — The Modern ERP for Coaching Institutes",
  description:
    "Automate attendance, track fee payments, communicate with parents, and grow your coaching institute with the smartest ERP platform built for Indian educators.",
  keywords: [
    "coaching institute management software",
    "ERP for coaching centers",
    "student attendance tracking",
    "fee management software India",
    "tuition center software",
    "EduTrack ERP",
  ],
  openGraph: {
    title: "EduTrack — The Modern ERP for Coaching Institutes",
    description:
      "Automate attendance, track fee payments, communicate with parents, and grow your coaching institute.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden scroll-smooth">
      <Navbar />
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
