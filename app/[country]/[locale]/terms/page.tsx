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
  const t = await getTranslations("terms");
  return {
    title: `${t("title")} - TheLawThing`,
    description: t("description"),
  };
}

export default async function TermsOfService({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");

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
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("acceptance")}</h2>
              <p>
                {t("acceptanceText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("useOfService")}</h2>
              <p>{t("useOfServiceText")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("harassingFalse")}</li>
                <li>{t("obsceneOffensive")}</li>
                <li>{t("disruptingFlow")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("intellectualProperty")}</h2>
              <p>
                {t("intellectualPropertyText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("userContent")}</h2>
              <p>
                {t("userContentText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("aiDisclaimer")}</h2>
              <p>{t("aiDisclaimerText")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("notLegalAdvice")}</li>
                <li>{t("supportProfessional")}</li>
                <li>{t("nonDeterministic")}</li>
                <li>{t("youResponsible")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("limitations")}</h2>
              <p>
                {t("limitationsText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("indemnification")}</h2>
              <p>
                {t("indemnificationText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("terminationSuspension")}</h2>
              <p>
                {t("terminationText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("modifications")}</h2>
              <p>
                {t("modificationsText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("privacyPolicy")}</h2>
              <p>
                {t("privacyPolicyText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("governingLaw")}</h2>
              <p>
                {t("governingLawText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("changes")}</h2>
              <p>
                {t("changesText")}
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
