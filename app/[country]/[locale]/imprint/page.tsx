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
  const t = await getTranslations("imprint");
  return {
    title: `${t("title")} - TheLawThing`,
    description: t("title"),
  };
}

export default async function Imprint({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("imprint");

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
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("providerInformation")}</h2>
              <p>
                <strong>{t("legalEntityName")}</strong> TheLawThing<br />
                <strong>{t("registeredOffice")}</strong> {t("registeredOfficeValue")}<br />
                <strong>{t("postalCode")}</strong> {t("postalCodeValue")}<br />
                <strong>{t("country")}</strong> {t("countryValue")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("commercialRegister")}</h2>
              <p>
                <strong>{t("registerCourt")}</strong> {t("registerCourtValue")}<br />
                <strong>{t("registrationNumber")}</strong> {t("registrationNumberValue")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("vatIdentification")}</h2>
              <p>
                <strong>{t("vatId")}</strong> {t("vatIdValue")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("managingDirectors")}</h2>
              <p>
                {t("managingDirectorsValue")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("contactInformation")}</h2>
              <p>
                <strong>Email:</strong> <a href="mailto:contact@info@thelawthing.com" className="text-primary-600 hover:underline">info@thelawthing.com</a><br />
                <strong>{t("support")}</strong> <a href="mailto:info@thelawthing.com" className="text-primary-600 hover:underline">info@thelawthing.com</a><br />
                <strong>{t("phone")}</strong> {t("phoneValue")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("supervisoryAuthority")}</h2>
              <p>
                {t("supervisoryAuthorityValue")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("disclaimer")}</h2>
              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("liabilityForContent")}</h3>
              <p>
                {t("liabilityForContentText")}
              </p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("liabilityForLinks")}</h3>
              <p>
                {t("liabilityForLinksText")}
              </p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">{t("noLegalAdvice")}</h3>
              <p>
                {t("noLegalAdviceText")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">{t("copyright")}</h2>
              <p>
                {t("copyrightText")}
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
