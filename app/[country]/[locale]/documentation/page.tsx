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
    <div className="min-h-screen bg-surface-100">
      <NavbarWrapper />

      {/* Hero Header */}
      <div className="bg-primary-900 text-white pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("title")}
          </h1>
          <p className="text-primary-100 text-lg">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-border-200">
          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("gettingStarted")}
              </h2>
              <p>{t("gettingStartedDesc")}</p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
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
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("understandingResults")}
              </h2>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
                {t("viabilityAssessment")}
              </h3>
              <p>{t("viabilityAssessmentDesc")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("favorable")}</li>
                <li>{t("uncertain")}</li>
                <li>{t("highRisk")}</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
                {t("scenarioBreakdowns")}
              </h3>
              <p>{t("scenarioBreakdownsDesc")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("bestCase")}</li>
                <li>{t("baseCase")}</li>
                <li>{t("worstCase")}</li>
              </ul>
              <p className="mt-4">{t("scenarioReasoning")}</p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
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
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
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
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("bestPractices")}
              </h2>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
                {t("dataQuality")}
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("provideAccurateData")}</li>
                <li>{t("uploadRelevant")}</li>
                <li>{t("updateCaseInfo")}</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
                {t("reviewValidation")}
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("reviewWithJudgment")}</li>
                <li>{t("verifyCitations")}</li>
                <li>{t("considerScenarios")}</li>
                <li>{t("consultCounsel")}</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">
                {t("privacySecurity")}
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("uploadRights")}</li>
                <li>{t("clientConfidentiality")}</li>
                <li>{t("reviewPolicies")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
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
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("needHelp")}
              </h2>
              <p>{t("needHelpDesc")}</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong>{t("email")}</strong>{" "}
                  <a
                    href="mailto:support@TheLawThing.dev"
                    className="text-primary-600 hover:underline"
                  >
                    support@TheLawThing.dev
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
