import Link from "next/link";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Check,
  Mail,
  Building2,
  ShieldCheck,
  Scale,
} from "lucide-react";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");
  return {
    title: `${t("title")} - TheLawThing`,
    description: t("description"),
  };
}

export default async function Pricing({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <NavbarWrapper />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#060b14] via-primary-950 to-[#0d1829] text-white pt-32 pb-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 100% 80% at 20% -15%, rgba(217,150,41,0.22), transparent 50%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50 mb-5">
            TheLawThing
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-medium mb-6 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flexible Plans Card */}
            <div className="bg-surface-000 rounded-2xl border border-border-200/90 p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-800 flex items-center justify-center text-accent-400 flex-shrink-0">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-medium text-ink-900 mb-2 tracking-tight">
                    {t("flexiblePlans")}
                  </h2>
                  <p className="text-ink-600 leading-relaxed">
                    {t("flexiblePlansDesc")}
                  </p>
                </div>
              </div>
            </div>

            {/* What's Included Card */}
            <div className="bg-surface-000 rounded-2xl border border-border-200/90 p-8 shadow-sm transition-shadow hover:shadow-md">
              <h2 className="font-display text-2xl font-medium text-ink-900 mb-6 tracking-tight">
                {t("whatsIncluded")}
              </h2>
              <p className="text-ink-600 mb-8">
                {t("whatsIncludedDesc")}
              </p>
              <div className="grid md:grid-cols-2 gap-y-4 gap-x-8">
                {(t.raw("included") as string[]).map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-1 bg-success-100 p-0.5 rounded-full flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-success-600" />
                      </div>
                      <span className="text-ink-700 text-sm leading-relaxed">
                        {item}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Contact / Pricing Model Card */}
            <div className="bg-surface-000 rounded-2xl border border-border-200 border-t-4 border-t-accent-500 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.15)] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-accent-100/60 rounded-full blur-xl" />

              <h2 className="font-display text-2xl font-medium text-ink-900 mb-4 tracking-tight">
                {t("contactForPricing")}
              </h2>
              <p className="text-ink-600 mb-6 text-sm leading-relaxed">
                {t("contactForPricingDesc")}
              </p>

              <ul className="space-y-3 mb-8 bg-surface-050 p-4 rounded-xl border border-border-100">
                {(t.raw("pricingBased") as string[]).map(
                  (item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-ink-900 text-sm font-medium"
                    >
                      <span className="w-1.5 h-1.5 bg-primary-600 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  )
                )}
              </ul>

              <div className="pt-6 border-t border-border-200">
                <h3 className="font-semibold text-ink-900 mb-2">
                  {t("getStarted")}
                </h3>
                <p className="text-sm text-ink-600 mb-4">
                  {t("getStartedDesc")}
                </p>
                <a
                  href="mailto:info@thelawthing.com"
                  className="flex items-center justify-center gap-2 bg-primary-800 text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md group"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  info@thelawthing.com
                </a>
              </div>
            </div>

            {/* Enterprise Options Card */}
            <div className="bg-gradient-to-br from-primary-50/80 to-surface-000 rounded-2xl border border-primary-100/90 p-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-600" />
                {t("enterpriseOptions")}
              </h2>
              <p className="text-primary-700 text-sm mb-4 leading-relaxed">
                {t("enterpriseOptionsDesc")}
              </p>
              <ul className="space-y-2.5">
                {(t.raw("enterprise") as string[]).map(
                  (item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-primary-800"
                    >
                      <ShieldCheck className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href={`/${country}/${locale}`}
            className="inline-flex items-center text-sm font-medium text-ink-600 hover:text-primary-800 transition-colors uppercase tracking-wide"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
