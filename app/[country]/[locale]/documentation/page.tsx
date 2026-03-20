import NavbarWrapper from "@/app/components/NavbarWrapper";
import BackToHome from "@/app/components/BackToHome";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("documentation");
  return {
    title: `${t("title")} - TheLawThing`,
    description: t("description"),
  };
}

export default async function Documentation({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("documentation");

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <NavbarWrapper />

      <div className="relative overflow-hidden bg-gradient-to-b from-[#060b14] via-primary-950 to-[#0d1829] text-white pt-32 pb-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 90% 70% at 30% -10%, rgba(217,150,41,0.18), transparent 50%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50 mb-5">
            TheLawThing
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-medium mb-4 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-10">
        <div className="bg-surface-000 rounded-2xl shadow-[0_24px_64px_-24px_rgba(15,23,42,0.15)] p-8 md:p-12 border border-border-200/90">
          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="font-display text-2xl font-medium text-ink-900 mt-8 mb-4 tracking-tight">
                {t("gettingStarted")}
              </h2>
              <p>{t("gettingStartedDesc")}</p>

              <h3 className="font-display text-xl font-medium text-ink-900 mt-6 mb-3">
                {t("creatingFirstAnalysis")}
              </h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>{t("startNewCase")}</li>
                <li>{t("uploadDocuments")}</li>
                <li>{t("enterCaseFacts")}</li>
                <li>{t("reviewAnalysis")}</li>
              </ol>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink-900 mt-8 mb-4 tracking-tight">
                {t("understandingResults")}
              </h2>

              <h3 className="font-display text-xl font-medium text-ink-900 mt-6 mb-3">
                {t("viabilityAssessment")}
              </h3>
              <p>{t("viabilityAssessmentDesc")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("favorable")}</li>
                <li>{t("uncertain")}</li>
                <li>{t("highRisk")}</li>
              </ul>

              <h3 className="font-display text-xl font-medium text-ink-900 mt-6 mb-3">
                {t("scenarioBreakdowns")}
              </h3>
              <p>{t("scenarioBreakdownsDesc")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("bestCase")}</li>
                <li>{t("baseCase")}</li>
                <li>{t("worstCase")}</li>
              </ul>
              <p className="mt-4">{t("scenarioReasoning")}</p>

              <h3 className="font-display text-xl font-medium text-ink-900 mt-6 mb-3">
                {t("actionableNextSteps")}
              </h3>
              <p>{t("actionableNextStepsDesc")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("missingDocuments")}</li>
                <li>{t("suggestedResearch")}</li>
                <li>{t("clientQuestions")}</li>
                <li>{t("potentialEvidence")}</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink-900 mt-8 mb-4 tracking-tight">
                {t("documentManagement")}
              </h2>
              <p>{t("documentManagementDesc")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("uploadFormats")}</li>
                <li>{t("organizeByCase")}</li>
                <li>{t("automaticClassification")}</li>
                <li>{t("generateSummaries")}</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink-900 mt-8 mb-4 tracking-tight">
                {t("bestPractices")}
              </h2>

              <h3 className="font-display text-xl font-medium text-ink-900 mt-6 mb-3">
                {t("dataQuality")}
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("provideAccurateData")}</li>
                <li>{t("uploadRelevant")}</li>
                <li>{t("updateCaseInfo")}</li>
              </ul>

              <h3 className="font-display text-xl font-medium text-ink-900 mt-6 mb-3">
                {t("reviewValidation")}
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("reviewWithJudgment")}</li>
                <li>{t("verifyCitations")}</li>
                <li>{t("considerScenarios")}</li>
                <li>{t("consultCounsel")}</li>
              </ul>

              <h3 className="font-display text-xl font-medium text-ink-900 mt-6 mb-3">
                {t("privacySecurity")}
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("uploadRights")}</li>
                <li>{t("clientConfidentiality")}</li>
                <li>{t("reviewPolicies")}</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink-900 mt-8 mb-4 tracking-tight">
                {t("limitations")}
              </h2>
              <div className="bg-warning-100 border-l-4 border-warning-500 p-4 my-4 rounded-r">
                <p className="font-semibold text-ink-900 mb-2">
                  {t("important")}
                </p>
                <p>{t("limitationsText")}</p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink-900 mt-8 mb-4 tracking-tight">
                {t("needHelp")}
              </h2>
              <p>{t("needHelpDesc")}</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong>{t("email")}</strong>{" "}
                  <a
                    href="mailto:info@thelawthing.com"
                    className="text-primary-600 hover:underline"
                  >
                    info@thelawthing.com
                  </a>
                </li>
                <li>{t("responseTime")}</li>
              </ul>
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
