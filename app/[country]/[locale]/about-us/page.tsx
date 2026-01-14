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
  const t = await getTranslations("aboutUs");
  return {
    title: `${t("title")} - TheLawThing`,
    description: t("description"),
  };
}

export default async function AboutUs({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aboutUs");

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
                {t("aboutTheLawThingTitle")}
              </h2>
              <p className="text-lg leading-relaxed">
                {t("platformDescription")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("visionTitle")}
              </h2>
              <p className="text-lg leading-relaxed">
                {t("visionDescription")}
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
