import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import TenancyGuideView from "@/app/components/seo/TenancyGuide";
import { getTenancyGuide, tenancyMetadata, tenancyStaticParams } from "@/lib/seo/tenancyGuides";

export const dynamicParams = false;

export function generateStaticParams() {
  return tenancyStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; locale: string; topic: string }>;
}) {
  const { country, locale, topic } = await params;
  const guide = getTenancyGuide(country, locale, topic);
  if (!guide) return {};
  return tenancyMetadata(guide);
}

export default async function TenancyTopicPage({
  params,
}: {
  params: Promise<{ country: string; locale: string; topic: string }>;
}) {
  const { country, locale, topic } = await params;
  setRequestLocale(locale);
  const guide = getTenancyGuide(country, locale, topic);
  if (!guide) notFound();
  return <TenancyGuideView guide={guide} />;
}
