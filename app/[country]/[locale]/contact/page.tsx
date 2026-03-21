import Link from "next/link";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  return {
    title: `${t("title")} - TheLawThing`,
    description: t("description"),
  };
}

export default async function Contact({
  params,
}: {
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <NavbarWrapper />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#060b14] via-primary-950 to-[#0d1829] text-white pt-32 pb-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 100% 80% at 80% -10%, rgba(56,120,180,0.2), transparent 50%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50 mb-5">
            TheLawThing
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-medium mb-4 tracking-tight">{t("title")}</h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-10">
        <div className="bg-surface-000 rounded-2xl shadow-[0_24px_64px_-24px_rgba(15,23,42,0.15)] p-8 md:p-12 border border-border-200/90">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-[#faf8f5] rounded-xl border border-border-200/80">
              <h2 className="font-display text-xl font-medium text-ink-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-800 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t("support.title")}
              </h2>
              <p className="text-ink-700 mb-3">
                {t("support.description")}
              </p>
              <p className="text-ink-900 font-semibold mb-1">
                <a href={`mailto:${t("support.email")}`} className="text-primary-800 hover:text-primary-950 hover:underline">
                  {t("support.email")}
                </a>
              </p>
              <p className="text-sm text-ink-600 mt-2">
                {t("support.responseTime")}
              </p>
            </div>

            <div className="p-6 bg-[#faf8f5] rounded-xl border border-border-200/80">
              <h2 className="font-display text-xl font-medium text-ink-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-800 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t("generalInquiries.title")}
              </h2>
              <p className="text-ink-700 mb-3">
                {t("generalInquiries.description")}
              </p>
              <p className="text-ink-900 font-semibold mb-1">
                <a href={`mailto:${t("generalInquiries.email")}`} className="text-primary-800 hover:text-primary-950 hover:underline">
                  {t("generalInquiries.email")}
                </a>
              </p>
              <p className="text-sm text-ink-600 mt-2">
                {t("generalInquiries.responseTime")}
              </p>
            </div>

            <div className="p-6 bg-[#faf8f5] rounded-xl border border-border-200/80">
              <h2 className="font-display text-xl font-medium text-ink-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-800 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {t("security.title")}
              </h2>
              <p className="text-ink-700 mb-3">
                {t("security.description")}
              </p>
              <p className="text-ink-900 font-semibold mb-1">
                <a href={`mailto:${t("security.email")}`} className="text-primary-800 hover:text-primary-950 hover:underline">
                  {t("security.email")}
                </a>
              </p>
              <p className="text-sm text-ink-600 mt-2">
                {t("security.responseTime")}
              </p>
            </div>

            <div className="p-6 bg-[#faf8f5] rounded-xl border border-border-200/80">
              <h2 className="font-display text-xl font-medium text-ink-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-800 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t("legal.title")}
              </h2>
              <p className="text-ink-700 mb-3">
                {t("legal.description")}
              </p>
              <p className="text-ink-900 font-semibold mb-1">
                <a href={`mailto:${t("legal.email")}`} className="text-primary-800 hover:text-primary-950 hover:underline">
                  {t("legal.email")}
                </a>
              </p>
              <p className="text-sm text-ink-600 mt-2">
                {t("legal.responseTime")}
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-primary-50/80 rounded-xl border border-primary-100">
            <h2 className="font-display text-xl font-medium text-ink-900 mb-3">{t("officeHours")}</h2>
            <p className="text-ink-700">
              {t("officeHoursDesc")}
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-border-200">
            <Link href={`/${country}/${locale}`} className="inline-flex items-center text-sm font-medium text-primary-800 hover:text-primary-950 uppercase tracking-wide group">
              <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> {t("backToHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
