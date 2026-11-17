import ConfidentialByDesign from "@/app/components/dashboard/ConfidentialByDesign";
import HeroSectionV2 from "@/app/components/dashboard/HeroSectionV2";
import WhatWeDo from "@/app/components/dashboard/WhatWeDo";
import HowItWorks from "@/app/components/dashboard/HowItWorks";
import HomeTenancySeo from "@/app/components/seo/HomeTenancySeo";
import { englishHomeMetadata, germanHomeMetadata } from "@/lib/seo/tenancyGuides";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;
  if (country === "de" && locale === "de") return germanHomeMetadata();
  if (country === "de" && locale === "en") return englishHomeMetadata();
  return {};
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-[#f7f4ef] to-[#f2f7fb]/80 text-ink-900">
      <HeroSectionV2 />

      <WhatWeDo />
      <HowItWorks />
      <ConfidentialByDesign />
      <HomeTenancySeo country={country} locale={locale} />
    </div>
  );
}
