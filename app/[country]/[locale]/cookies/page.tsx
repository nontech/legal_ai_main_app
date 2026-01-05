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
  const t = await getTranslations("cookies");
  return {
    title: `${t("title")} - TheLawThing`,
    description: t("description"),
  };
}

export default async function CookiePolicy({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cookies");

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
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("whatAreCookies")}</h2>
              <p>
                {t("cookiesDefinition")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("whyWeUse")}</h2>
              <p>{t("whyWeUseDesc")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("improveExperience")}</li>
                <li>{t("rememberPreferences")}</li>
                <li>{t("analyzeUsage")}</li>
                <li>{t("preventFraud")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("typesOfCookies")}</h2>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("essentialCookies")}</h3>
              <p>
                {t("essentialDesc")}
              </p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("performanceCookies")}</h3>
              <p>
                {t("performanceDesc")}
              </p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("functionalCookies")}</h3>
              <p>
                {t("functionalDesc")}
              </p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("marketingCookies")}</h3>
              <p>
                {t("marketingDesc")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("yourCookieChoices")}</h2>
              <p>
                {t("cookieChoicesDesc")}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("refuseCookies")}</li>
                <li>{t("deleteCookies")}</li>
                <li>{t("blockCookies")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("note")}</h2>
              <p>
                {t("noteText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("thirdPartyCookies")}</h2>
              <p>
                {t("thirdPartyDesc")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("doNotTrack")}</h2>
              <p>
                {t("doNotTrackDesc")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("changesToPolicy")}</h2>
              <p>
                {t("changesDesc")}
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
