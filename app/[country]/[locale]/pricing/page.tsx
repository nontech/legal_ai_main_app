import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { getTranslations } from "next-intl/server";
import {
  Check,
  Mail,
  Building2,
  ShieldCheck,
  Scale,
} from "lucide-react";

export async function generateMetadata() {
  const t = await getTranslations("pricing");
  return {
    title: `${t("title")} - TheLawThing`,
    description: t("description"),
  };
}

export default async function Pricing() {
  const t = await getTranslations("pricing");

  return (
    <div className="min-h-screen bg-surface-100">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-primary-900 text-white pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("title")}
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flexible Plans Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-border-200 p-8 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center text-accent-600 flex-shrink-0">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-ink-900 mb-2">
                    {t("flexiblePlans")}
                  </h2>
                  <p className="text-ink-600 leading-relaxed">
                    {t("flexiblePlansDesc")}
                  </p>
                </div>
              </div>
            </div>

            {/* What's Included Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-border-200 p-8 transition-shadow hover:shadow-md">
              <h2 className="text-2xl font-bold text-ink-900 mb-6">
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
            <div className="bg-white rounded-2xl shadow-xl border-t-4 border-accent-500 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-accent-50 rounded-full opacity-50 blur-xl"></div>

              <h2 className="text-2xl font-bold text-ink-900 mb-4">
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
                <h3 className="font-bold text-ink-900 mb-2">
                  {t("getStarted")}
                </h3>
                <p className="text-sm text-ink-600 mb-4">
                  {t("getStartedDesc")}
                </p>
                <a
                  href="mailto:contact@TheLawThing.dev"
                  className="flex items-center justify-center gap-2 bg-primary-900 text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-all shadow-sm hover:shadow group"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  contact@TheLawThing.dev
                </a>
              </div>
            </div>

            {/* Enterprise Options Card */}
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-100 p-6">
              <h2 className="text-lg font-bold text-primary-900 mb-3 flex items-center gap-2">
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
            href="/"
            className="inline-flex items-center text-ink-500 hover:text-primary-600 font-medium transition-colors"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
