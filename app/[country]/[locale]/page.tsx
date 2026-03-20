import ConfidentialByDesign from "@/app/components/dashboard/ConfidentialByDesign";
import HeroSectionV2 from "@/app/components/dashboard/HeroSectionV2";
import WhatWeDo from "@/app/components/dashboard/WhatWeDo";
import HowItWorks from "@/app/components/dashboard/HowItWorks";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-ink-900">
      <div className="pt-24">
        <HeroSectionV2 />
      </div>

      <WhatWeDo />
      <HowItWorks />
      <ConfidentialByDesign />
    </div>
  );
}
