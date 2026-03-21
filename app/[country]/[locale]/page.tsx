import ConfidentialByDesign from "@/app/components/dashboard/ConfidentialByDesign";
import HeroSectionV2 from "@/app/components/dashboard/HeroSectionV2";
import WhatWeDo from "@/app/components/dashboard/WhatWeDo";
import HowItWorks from "@/app/components/dashboard/HowItWorks";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-[#f7f4ef] to-[#f2f7fb]/80 text-ink-900">
      <HeroSectionV2 />

      <WhatWeDo />
      <HowItWorks />
      <ConfidentialByDesign />
    </div>
  );
}
