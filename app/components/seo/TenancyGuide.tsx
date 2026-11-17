import Link from "next/link";
import type { TenancyGuide as TenancyGuideData } from "@/lib/seo/tenancyGuides";

function faqJsonLd(guide: TenancyGuideData) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export default function TenancyGuide({ guide }: { guide: TenancyGuideData }) {
  return (
    <article className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-[#f7f4ef] to-[#f2f7fb]/80 text-ink-900">
      <header className="mx-auto max-w-3xl px-4 pb-10 pt-32 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
          TheLawThing · Berlin
        </p>
        <h1 className="font-display mt-3 text-4xl font-medium tracking-tight text-ink-900 sm:text-5xl">
          {guide.h1}
        </h1>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-700 sm:text-lg">
          {guide.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-6 border-l-4 border-accent-400 bg-surface-050 px-4 py-3 text-sm leading-relaxed text-ink-600">
          {guide.disclaimer}
        </p>
        <div className="mt-8">
          <Link
            href={guide.cta.href}
            className="inline-flex items-center justify-center rounded-md bg-primary-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-900"
          >
            {guide.cta.label}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-12 px-4 pb-20 sm:px-6">
        {guide.sections.map((section) => (
          <section key={section.h2} className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-ink-900">{section.h2}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-ink-700">
                {paragraph}
              </p>
            ))}
            {section.subsections?.map((subsection) => (
              <div key={subsection.h3} className="space-y-3 pt-2">
                <h3 className="text-xl font-semibold text-ink-900">{subsection.h3}</h3>
                {subsection.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-ink-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </section>
        ))}

        <section className="rounded-2xl border border-border-200 bg-surface-000 p-6 shadow-sm">
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            {guide.route.locale === "de" ? "Verwandte Mietrecht-Themen" : "Related tenancy guides"}
          </h2>
          <ul className="mt-4 space-y-3">
            {guide.related.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-medium text-primary-800 underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            {guide.route.locale === "de" ? "Häufige Fragen" : "Common questions"}
          </h2>
          <div className="mt-4 space-y-4">
            {guide.faqs.map((faq) => (
              <details key={faq.question} className="rounded-xl border border-border-200 bg-surface-000 px-4 py-3">
                <summary className="cursor-pointer font-semibold text-ink-900">{faq.question}</summary>
                <p className="mt-2 leading-relaxed text-ink-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="rounded-2xl bg-primary-900 px-6 py-8 text-white">
          <p className="font-display text-2xl font-medium">{guide.cta.label}</p>
          <Link
            href={guide.cta.href}
            className="mt-5 inline-flex items-center justify-center rounded-md bg-accent-400 px-6 py-3 text-sm font-semibold text-primary-950 hover:bg-accent-300"
          >
            {guide.cta.label}
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(guide)) }} />
    </article>
  );
}
