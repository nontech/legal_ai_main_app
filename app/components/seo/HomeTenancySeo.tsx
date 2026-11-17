import Link from "next/link";
import { DISCLAIMER_DE, DISCLAIMER_EN, GERMAN_HOME_SEO } from "@/lib/seo/tenancyGuides";
import { CASE_ANALYSIS_DE, CASE_ANALYSIS_EN, ENGLISH_HUB_PATH, SEO_ROUTES } from "@/lib/seo/routes";

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GERMAN_HOME_SEO.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export default function HomeTenancySeo({ country, locale }: { country: string; locale: string }) {
  if (country !== "de") return null;

  if (locale === "en") {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-medium text-ink-900">Tenant rights in Germany, in English</h2>
        <p className="mt-4 leading-relaxed text-ink-700">
          TheLawThing is based in Berlin and explains German tenancy disputes for readers who need English.
          The guide covers tenant rights in Berlin and the rest of Germany, Eigenbedarf, and a landlord holding the deposit.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-600">{DISCLAIMER_EN}</p>
        <Link
          href={ENGLISH_HUB_PATH}
          className="mt-6 inline-flex font-semibold text-primary-800 underline-offset-4 hover:underline"
        >
          Read tenant rights Germany
        </Link>
      </section>
    );
  }

  if (locale !== "de") return null;

  const topics = SEO_ROUTES.filter((route) => route.locale === "de");

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="font-display text-3xl font-medium text-ink-900">Mietstreitigkeiten nach Thema</h2>
      <p className="mt-4 leading-relaxed text-ink-700">
        Die folgenden Seiten erklären einzelne Streitpunkte als allgemeine Information. Jede Seite führt in die
        Fallanalyse, wenn Sie die Erfolgsaussichten Ihres eigenen Falls prüfen wollen.
      </p>
      <ul className="mt-6 space-y-3">
        {topics.map((topic) => (
          <li key={topic.publicPath}>
            <Link href={topic.publicPath} className="font-medium text-primary-800 underline-offset-4 hover:underline">
              {topic.navLabel}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link
          href={CASE_ANALYSIS_DE}
          className="inline-flex items-center justify-center rounded-md bg-primary-800 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-900"
        >
          Mietstreitigkeiten Erfolgsaussichten prüfen
        </Link>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-ink-600">{DISCLAIMER_DE}</p>

      <h2 className="font-display mt-12 text-3xl font-medium text-ink-900">Häufige Fragen zur Ersteinschätzung</h2>
      <div className="mt-4 space-y-4">
        {GERMAN_HOME_SEO.faqs.map((faq) => (
          <details key={faq.question} className="rounded-xl border border-border-200 bg-surface-000 px-4 py-3">
            <summary className="cursor-pointer font-semibold text-ink-900">{faq.question}</summary>
            <p className="mt-2 leading-relaxed text-ink-700">{faq.answer}</p>
          </details>
        ))}
      </div>
      <p className="mt-8 text-sm text-ink-600">
        English overview:{" "}
        <Link href={ENGLISH_HUB_PATH} className="font-medium text-primary-800 underline-offset-4 hover:underline">
          Tenant rights Germany
        </Link>
        . The case analysis in English starts at{" "}
        <Link href={CASE_ANALYSIS_EN} className="font-medium text-primary-800 underline-offset-4 hover:underline">
          the English case analysis
        </Link>
        .
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
    </section>
  );
}
