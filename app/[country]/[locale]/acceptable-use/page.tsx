import NavbarWrapper from "@/app/components/NavbarWrapper";
import BackToHome from "@/app/components/BackToHome";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("acceptableUse");
  return {
    title: `${t("title")} - TheLawThing`,
    description: t("description"),
  };
}

export default async function AcceptableUse({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("acceptableUse");

  return (
    <div className="min-h-screen bg-surface-100">
      <NavbarWrapper />
      
      {/* Hero Header */}
      <div className="bg-primary-900 text-white pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-primary-100 text-lg">
            {t("lastUpdated")}{" "}
            {new Date().toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-border-200">
          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("purpose")}
              </h2>
              <p>
                {t("purposeText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("prohibitedActivities")}
              </h2>
              <p>{t("prohibitedDesc")}</p>

              <ul className="list-disc pl-6 space-y-2">
                <li>{t("illegalActivities")}</li>
                <li>{t("intellectualProperty")}</li>
                <li>{t("maliciousSoftware")}</li>
                <li>{t("harass")}</li>
                <li>{t("spamPhishing")}</li>
                <li>{t("systemInterference")}</li>
                <li>{t("reverseEngineering")}</li>
                <li>{t("confidentialityViolation")}</li>
                <li>{t("moneyLaundering")}</li>
                <li>{t("discriminatory")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("dataResponsibility")}
              </h2>
              <p>{t("dataResponsibilityText")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("ensureRights")}</li>
                <li>{t("clientConfidentiality")}</li>
                <li>{t("dataAccuracy")}</li>
                <li>{t("complianceLaws")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("securityPractices")}
              </h2>
              <p>{t("securityText")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("protectPassword")}</li>
                <li>{t("reportUnauthorized")}</li>
                <li>{t("useSecureConnection")}</li>
                <li>{t("updateInfo")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("enforcement")}
              </h2>
              <p>
                {t("enforcementText")}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("investigateViolations")}</li>
                <li>{t("suspendTerminate")}</li>
                <li>{t("reportAuthorities")}</li>
                <li>{t("notifyVictims")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("reporting")}
              </h2>
              <p>
                {t("reportingText")}{" "}
                <a
                  href="mailto:abuse@TheLawThing.dev"
                  className="text-primary-600 hover:underline"
                >
                  abuse@TheLawThing.dev
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border-200">
            <BackToHome country={country} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
