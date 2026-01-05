import Navbar from "@/app/components/Navbar";
import BackToHome from "@/app/components/BackToHome";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  return {
    title: `${t("title")} - TheLawThing`,
    description: t("description"),
  };
}

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <div className="min-h-screen bg-surface-100">
      <Navbar />
      
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
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("introduction")}</h2>
              <p>
                {t("introductionText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("informationWeCollect")}</h2>
              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("informationYouProvide")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("accountInfo")}</li>
                <li>{t("caseData")}</li>
                <li>{t("communicationData")}</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("automaticallyCollected")}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("usageData")}</li>
                <li>{t("deviceInfo")}</li>
                <li>{t("cookies")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("howWeUse")}</h2>
              <p>{t("howWeUseDesc")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("provideService")}</li>
                <li>{t("processAnalyses")}</li>
                <li>{t("communicateService")}</li>
                <li>{t("ensureSecurity")}</li>
                <li>{t("complylegal")}</li>
              </ul>
              <p className="mt-4 font-semibold">
                <strong>{t("importantNote")}:</strong> {t("importantNoteText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("dataSharing")}</h2>
              <p>{t("dataSharingDesc")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("serviceProviders")}</li>
                <li>{t("requiredByLaw")}</li>
                <li>{t("businessTransfer")}</li>
                <li>{t("yourConsent")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("dataSecurity")}</h2>
              <p>
                {t("dataSecurityText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("yourRights")}</h2>
              <p>{t("yourRightsDesc")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("accessData")}</li>
                <li>{t("correctData")}</li>
                <li>{t("deleteData")}</li>
                <li>{t("objectProcessing")}</li>
                <li>{t("dataPortability")}</li>
                <li>{t("withdrawConsent")}</li>
              </ul>
              <p className="mt-4">
                {t("exerciseRights")} <a href="mailto:privacy@TheLawThing.dev" className="text-primary-600 hover:underline">privacy@TheLawThing.dev</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("dataRetention")}</h2>
              <p>
                {t("dataRetentionText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("internationalTransfers")}</h2>
              <p>
                {t("internationalTransfersText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("childrenPrivacy")}</h2>
              <p>
                {t("childrenPrivacyText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("changesPolicy")}</h2>
              <p>
                {t("changesPolicyText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("contactUs")}</h2>
              <p>
                {t("contactUsText")}
              </p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:privacy@TheLawThing.dev" className="text-primary-600 hover:underline">privacy@TheLawThing.dev</a>
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
