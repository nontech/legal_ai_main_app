import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { getTranslations } from "next-intl/server";

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-ink-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-ink-600 mb-8">
            {t("description")}
          </p>

          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("flexiblePlans")}
              </h2>
              <p>{t("flexiblePlansDesc")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("contactForPricing")}
              </h2>
              <p>{t("contactForPricingDesc")}</p>
              <ul className="list-disc pl-6 space-y-2">
                {(t.raw("pricingBased") as string[]).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("whatsIncluded")}
              </h2>
              <p>{t("whatsIncludedDesc")}</p>
              <ul className="list-disc pl-6 space-y-2">
                {(t.raw("included") as string[]).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("enterpriseOptions")}
              </h2>
              <p>{t("enterpriseOptionsDesc")}</p>
              <ul className="list-disc pl-6 space-y-2">
                {(t.raw("enterprise") as string[]).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("getStarted")}
              </h2>
              <p>{t("getStartedDesc")}</p>
              <p className="mt-4">
                <strong>{t("email")}</strong>{" "}
                <a
                  href="mailto:contact@TheLawThing.dev"
                  className="text-primary-600 hover:underline"
                >
                  contact@TheLawThing.dev
                </a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border-200">
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {t("backToHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
