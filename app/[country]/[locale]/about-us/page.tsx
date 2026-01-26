import NavbarWrapper from "@/app/components/NavbarWrapper";
import BackToHome from "@/app/components/BackToHome";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Linkedin } from "lucide-react";

const teamMembers = [
  {
    name: "Aman Jaiswal",
    linkedin: "https://www.linkedin.com/in/aman-jaiswal07/",
  },
  {
    name: "Mukesh Jaiswal",
    linkedin: "https://www.linkedin.com/in/jais-mukesh/",
  },
  {
    name: "Philip Tapiwa",
    linkedin: "https://www.linkedin.com/in/philip-m-40917013b/",
  },
  {
    name: "Helen Lindenberg",
    linkedin: "https://www.linkedin.com/in/helen-lindenberg/",
  },
];

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

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">
                {t("teamTitle")}
              </h2>
              <p className="text-lg leading-relaxed mb-8">
                {t("teamDescription")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {teamMembers.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center justify-between p-4 bg-surface-50 rounded-xl border border-border-200 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <span className="font-medium text-ink-900">
                      {member.name}
                    </span>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
                      aria-label={`${t("viewLinkedIn")} - ${member.name}`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                ))}
              </div>
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
