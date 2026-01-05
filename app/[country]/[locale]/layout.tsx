import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { COUNTRIES } from "@/i18n/routing";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const validCountries = COUNTRIES.map((c) => c.code);
const validLocales = ["en", "de"];

// Generate static params for all country/locale combinations
export function generateStaticParams() {
  return COUNTRIES.flatMap((country) =>
    country.locales.map((locale) => ({
      country: country.code,
      locale: locale,
    }))
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ country: string; locale: string }>;
}) {
  const { country, locale } = await params;

  // Validate country and locale
  if (
    !validCountries.includes(country as any) ||
    !validLocales.includes(locale as any)
  ) {
    notFound();
  }

  // Enable static rendering by setting the locale for this request
  setRequestLocale(locale);

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages({ locale });

  // Note: html and body tags are removed here because they are already provided by root layout
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar />
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}
