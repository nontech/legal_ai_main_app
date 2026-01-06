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
  const t = await getTranslations("security");
  return {
    title: `${t("title")} - TheLawThing`,
    description: t("description"),
  };
}

export default async function Security({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("security");

  return (
    <div className="min-h-screen bg-surface-100">
      <NavbarWrapper />
      
      {/* Hero Header */}
      <div className="bg-primary-900 text-white pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-primary-100 text-lg">
            {t("lastUpdated")} {new Date().toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-border-200">
          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("ourCommitment")}</h2>
              <p>
                {t("commitmentText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("securityMeasures")}</h2>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("encryption")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("inTransit")}</li>
                <li>{t("atRest")}</li>
                <li>{t("backups")}</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("accessControls")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("mfa")}</li>
                <li>{t("sso")}</li>
                <li>{t("rbac")}</li>
                <li>{t("sessionManagement")}</li>
                <li>{t("leastPrivilege")}</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("networkSecurity")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("networkSegmentation")}</li>
                <li>{t("firewall")}</li>
                <li>{t("ddosProtection")}</li>
                <li>{t("monitoring")}</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("applicationSecurity")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("sdlc")}</li>
                <li>{t("codeReview")}</li>
                <li>{t("dependencyScanning")}</li>
                <li>{t("sast")}</li>
                <li>{t("dast")}</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("dataIsolation")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("logicalIsolation")}</li>
                <li>{t("noAITraining")}</li>
                <li>{t("retentionPolicies")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("complianceCertifications")}</h2>
              <p>
                {t("complianceDesc")}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("soc2")}</li>
                <li>{t("iso27001")}</li>
                <li>{t("gdprCcpa")}</li>
                <li>{t("thirdPartyAssessments")}</li>
                <li>{t("penetrationTesting")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("vendorRiskManagement")}</h2>
              <p>
                {t("vendorRiskText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("incidentResponse")}</h2>
              <p>
                {t("incidentResponseText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("vulnerabilityReporting")}</h2>
              <p>
                {t("vulnerabilityText")} <a href="mailto:security@TheLawThing.dev" className="text-primary-600 hover:underline">security@TheLawThing.dev</a>.
              </p>
              <p className="mt-4">
                {t("reportInclude")}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("stepsToReproduce")}</li>
                <li>{t("impactAssessment")}</li>
                <li>{t("affectedEndpoints")}</li>
              </ul>
              <p className="mt-4">
                {t("acknowledgement")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("dataProcessingAgreements")}</h2>
              <p>
                {t("dpaText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("contact")}</h2>
              <p>
                {t("contactText")} <a href="mailto:security@TheLawThing.dev" className="text-primary-600 hover:underline">security@TheLawThing.dev</a>.
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
