import {
  CASE_ANALYSIS_DE,
  CASE_ANALYSIS_EN,
  ENGLISH_HOME_PATH,
  ENGLISH_HUB_PATH,
  GERMAN_HOME_PATH,
  SEO_ROUTES,
  absoluteUrl,
  hreflangLanguages,
  type SeoRoute,
} from "./routes.ts";

export const DISCLAIMER_DE =
  "Allgemeine Information zum deutschen Mietrecht, keine Rechtsberatung. TheLawThing ersetzt nicht die Beratung durch eine zugelassene Anwältin oder einen zugelassenen Anwalt. Eine KI-gestützte Ersteinschätzung ist keine individuelle Rechtsberatung im Sinne des Rechtsdienstleistungsgesetzes (RDG).";

export const DISCLAIMER_EN =
  "General information about German tenancy law, not legal advice. TheLawThing does not replace advice from a lawyer licensed in Germany. An AI-assisted first assessment is not individual legal advice under the German Legal Services Act (RDG).";

export type GuideSection = {
  h2: string;
  paragraphs: string[];
  subsections?: { h3: string; paragraphs: string[] }[];
};

export type GuideFaq = { question: string; answer: string };

export type TenancyGuide = {
  route: SeoRoute;
  title: string;
  description: string;
  h1: string;
  /** Phrases that must appear in the first 100 words of the intro. */
  leadKeywords: string[];
  intro: string[];
  sections: GuideSection[];
  cta: { label: string; href: string };
  related: { href: string; label: string }[];
  faqs: GuideFaq[];
  disclaimer: string;
};

const de = (slug: string): SeoRoute => {
  const route = SEO_ROUTES.find((item) => item.slug === slug);
  if (!route) throw new Error(`Missing SEO route ${slug}`);
  return route;
};

const related = (slug: string, label: string) => {
  const route = de(slug);
  return { href: route.publicPath, label };
};

export const TENANCY_GUIDES: readonly TenancyGuide[] = [
  {
    route: de("eigenbedarfskuendigung"),
    title: "Eigenbedarfskündigung prüfen | TheLawThing",
    description:
      "Eigenbedarfskündigung prüfen: Gründe, Fristen und Widerspruch nach dem BGB. KI-gestützte Ersteinschätzung starten.",
    h1: "Eigenbedarfskündigung prüfen",
    leadKeywords: ["Eigenbedarfskündigung", "Eigenbedarf Kündigung", "Eigenbedarf prüfen lassen"],
    intro: [
      "Eine Eigenbedarfskündigung ist die Eigenbedarf Kündigung, mit der Vermieterinnen und Vermieter das Mietverhältnis beenden wollen, weil sie die Wohnung selbst benötigen. Eigenbedarf prüfen lassen heißt hier: die gesetzlichen Voraussetzungen einordnen, nicht ein Musterschreiben ausfüllen.",
      "TheLawThing ist eine KI-gestützte Ersteinschätzung für Mietstreitigkeiten in Deutschland, entwickelt in Berlin. Sie ersetzt keine anwaltliche Prüfung.",
    ],
    sections: [
      {
        h2: "Was erlaubt § 573 BGB beim Eigenbedarf?",
        paragraphs: [
          "Nach § 573 Abs. 1 BGB kann der Vermieter ordentlich kündigen, wenn er ein berechtigtes Interesse hat. § 573 Abs. 2 Nr. 2 BGB nennt als Beispiel, dass der Vermieter die Räume als Wohnung für sich, seine Familienangehörigen oder Angehörige seines Haushalts benötigt.",
          "Das Interesse muss ernsthaft und nachvollziehbar sein. Eine bloße Absicht, die Wohnung irgendwann anders zu nutzen, reicht nach dem Gesetzestext nicht aus. Ob der vorgetragene Bedarf in Ihrem Fall trägt, hängt vom Kündigungsschreiben und den tatsächlichen Umständen ab.",
        ],
        subsections: [
          {
            h3: "Wer kann den Eigenbedarf anmelden?",
            paragraphs: [
              "Der Wortlaut des § 573 Abs. 2 Nr. 2 BGB umfasst den Vermieter selbst, Familienangehörige und Angehörige des Haushalts. Welche Personen im Einzelfall dazugehören, ist Auslegungssache. Eine Ersteinschätzung kann die Konstellation sortieren; eine verbindliche Einordnung trifft das Gesetz nicht pauschal.",
            ],
          },
          {
            h3: "Müssen die Gründe in der Kündigung stehen?",
            paragraphs: [
              "Ja. § 573 Abs. 3 BGB verlangt, dass die Gründe im Kündigungsschreiben angegeben werden. Gründe, die nicht genannt sind, können später nur unter engen Voraussetzungen nachgeschoben werden. Heben Sie das Schreiben und das Datum des Zugangs auf.",
            ],
          },
        ],
      },
      {
        h2: "Welche Eigenbedarf Kündigungsfrist gilt?",
        paragraphs: [
          "Die Frist steht in § 573c BGB. Die ordentliche Kündigung ist spätestens am dritten Werktag eines Kalendermonats zum Ablauf des übernächsten Monats zulässig. Für den Vermieter verlängert sich die Frist auf sechs Monate, wenn das Mietverhältnis fünf Jahre bestanden hat, und auf neun Monate nach acht Jahren.",
          "Maßgeblich ist der Zugang der Kündigung, nicht das Datum auf dem Briefkopf. Steht im Vertrag eine abweichende Regelung, muss sie am Gesetz gemessen werden. Eine kürzere Frist zu Lasten des Mieters ist bei der ordentlichen Kündigung in der Regel nicht wirksam.",
        ],
      },
      {
        h2: "Wie legt man Widerspruch gegen eine Eigenbedarfskündigung ein?",
        paragraphs: [
          "§ 574 BGB erlaubt dem Mieter, der Kündigung zu widersprechen, wenn die Beendigung eine Härte bedeuten würde, die auch unter Würdigung der Vermieterinteressen nicht zu rechtfertigen ist. Beispiele im Gesetz sind hohes Alter, schwere Erkrankung und das Fehlen eines angemessenen Ersatzwohnraums. Die Aufzählung ist nicht abschließend.",
          "§ 574b BGB verlangt die Schriftform. Der Widerspruch muss dem Vermieter grundsätzlich spätestens zwei Monate vor dem Beendigungszeitpunkt zugehen. Der Vermieter muss in der Kündigung auf Form und Frist hinweisen. Fehlt der Hinweis, kann der Widerspruch im ersten Termin eines Räumungsrechtsstreits noch erklärt werden.",
          "Ein fertiges Widerspruch-Muster stellen wir nicht bereit. Ein wirksames Schreiben muss zu Ihrer Kündigung, Ihrer Härte und Ihrer Frist passen. Die Fallanalyse hilft, die Punkte zu sortieren, bevor Sie einen Anwalt oder einen Mieterverein einschalten.",
        ],
      },
      {
        h2: "Eigenbedarf vorgetäuscht: was tun?",
        paragraphs: [
          "Wirkt der Bedarf nicht ernsthaft, kann die Kündigung unwirksam sein. Typische Anhaltspunkte sind widersprüchliche Begründungen, ein kurzfristiger Verkauf oder eine sofortige Weitervermietung nach Ihrem Auszug. Das sind Indizien, kein Automatismus.",
          "Wer bereits ausgezogen ist, kann unter Umständen Schadensersatz prüfen. Ob ein Anspruch besteht und in welcher Höhe, lässt sich ohne die Unterlagen und ohne anwaltliche Beratung nicht sagen. Bewahren Sie Anzeigen, Nachrichten und den zeitlichen Ablauf auf.",
        ],
      },
    ],
    cta: { label: "Jetzt Eigenbedarf prüfen", href: CASE_ANALYSIS_DE },
    related: [
      related("klage-amtsgericht-mietrecht", "Klage beim Amtsgericht im Mietrecht verstehen"),
      related("mieterschutzverein-alternative", "Mieterverein und Ersteinschätzung vergleichen"),
      related("mietkaution", "Mietkaution zurückfordern nach dem Auszug"),
      { href: ENGLISH_HUB_PATH, label: "Tenant rights Germany in English" },
    ],
    faqs: [
      {
        question: "Ist jede Eigenbedarfskündigung wirksam?",
        answer:
          "Nein. Der Vermieter braucht ein berechtigtes Interesse nach § 573 BGB, und die Gründe müssen in der Kündigung stehen. Ob der Bedarf ernsthaft ist, hängt vom Einzelfall ab.",
      },
      {
        question: "Wie lang ist die Kündigungsfrist bei Eigenbedarf?",
        answer:
          "§ 573c BGB sieht den dritten Werktag eines Monats zum Ablauf des übernächsten Monats vor. Nach fünf Jahren Mietdauer verlängert sich die Vermieterfrist auf sechs Monate, nach acht Jahren auf neun Monate.",
      },
      {
        question: "Bis wann muss der Widerspruch zugehen?",
        answer:
          "Nach § 574b BGB grundsätzlich spätestens zwei Monate vor Beendigung des Mietverhältnisses, in Schriftform. Fehlt in der Kündigung der gesetzliche Hinweis, kann der Widerspruch noch im ersten Gerichtstermin erklärt werden.",
      },
      {
        question: "Bekomme ich hier ein Muster für den Widerspruch?",
        answer:
          "Nein. Ein Musterschreiben wäre keine sichere Lösung, weil Härte, Frist und Begründung zu Ihrer Kündigung passen müssen. Die Analyse sortiert die Punkte; ein Anwalt oder Mieterverein formuliert das Schreiben, wenn Sie das wollen.",
      },
      {
        question: "Was tun, wenn der Eigenbedarf nur behauptet wirkt?",
        answer:
          "Sichern Sie das Kündigungsschreiben und alles, was zum Bedarf nicht passt. Eine vorgetäuschte Begründung kann die Kündigung unwirksam machen. Schadensersatz nach einem Auszug ist möglich, aber nicht pauschal bezifferbar.",
      },
    ],
    disclaimer: DISCLAIMER_DE,
  },
  {
    route: de("mietpreisbremse"),
    title: "Mietpreisbremse prüfen | TheLawThing",
    description:
      "Mietpreisbremse prüfen: 10-Prozent-Grenze, Ausnahmen und Rüge nach §§ 556d ff. BGB. Ersteinschätzung starten.",
    h1: "Mietpreisbremse prüfen",
    leadKeywords: ["Mietpreisbremse prüfen", "Miete zu hoch was tun", "Mietspiegel prüfen"],
    intro: [
      "Die Mietpreisbremse prüfen lohnt sich, wenn Sie bei Mietbeginn vermuten, die Miete liege deutlich über der ortsüblichen Vergleichsmiete. Miete zu hoch was tun beginnt mit dem örtlichen Mietspiegel prüfen, nicht mit einem automatischen Rechner.",
      "TheLawThing ordnet Ihre Unterlagen als KI-gestützte Ersteinschätzung ein. Eine Berechnung der zulässigen Miete in Euro liefern wir nicht.",
    ],
    sections: [
      {
        h2: "Wann gilt die Mietpreisbremse nach § 556d BGB?",
        paragraphs: [
          "§ 556d BGB begrenzt die Miete zu Beginn eines Mietverhältnisses in Gebieten, die die Landesregierung als angespannten Wohnungsmarkt ausgewiesen hat. Die ausgewiesene Miete darf die ortsübliche Vergleichsmiete um nicht mehr als 10 Prozent übersteigen.",
          "Ob Ihr Ort heute ausgewiesen ist, steht in der aktuellen Landesverordnung. Verordnungen laufen aus und werden neu erlassen. Prüfen Sie den Stand für Ihre Gemeinde, auch in Berlin, statt sich auf einen älteren Artikel zu verlassen.",
        ],
      },
      {
        h2: "Welche Ausnahmen nennt das Gesetz?",
        paragraphs: [
          "§ 556f BGB nimmt unter anderem Wohnungen aus, die nach dem 1. Oktober 2014 erstmals genutzt und vermietet werden, sowie die erste Vermietung nach umfassender Modernisierung. § 556e BGB erlaubt in bestimmten Fällen, eine bereits höhere Vormiete fortzuführen.",
          "Welche Ausnahme greift, steht nicht auf der Wohnungsanzeige. Maßgeblich sind Baujahr, vorherige Miete und der Umfang einer Modernisierung. Fehlen diese Angaben, kann die Fallanalyse nur markieren, welche Unterlagen noch fehlen.",
        ],
      },
      {
        h2: "Wie hängt die Mietpreisbremse mit dem Mietspiegel zusammen?",
        paragraphs: [
          "Die ortsübliche Vergleichsmiete ergibt sich nach § 558 Abs. 2 BGB insbesondere aus einem Mietspiegel, aus einer Auskunft aus einer Mietdatenbank, aus einem Sachverständigengutachten oder aus vergleichbaren Wohnungen. Ein qualifizierter Mietspiegel hat eine stärkere gesetzliche Vermutungswirkung als ein einfacher.",
          "Wir lesen keinen städtischen Mietspiegel automatisch aus und bieten keinen Mietpreisbremse-Rechner. Sie können den für Ihre Wohnung passenden Spiegel selbst heranziehen und die Spanne mit der vereinbarten Miete vergleichen. Die Analyse hilft, Vertrag, Staffel und Ausnahmen nebeneinanderzulegen.",
        ],
      },
      {
        h2: "Was bringt eine Rüge, und wie widerspricht man einer Mieterhöhung?",
        paragraphs: [
          "Zu viel gezahlte Miete kann der Vermieter nach § 556g BGB nur zurückverlangen müssen, wenn der Mieter eine Rüge ausgesprochen hat. Die Rüge muss die Tatsachen nennen, auf denen die Beanstandung beruht. Ohne Rüge entsteht der Rückzahlungsanspruch in der Regel nicht.",
          "Eine spätere Mieterhöhung bis zur ortsüblichen Vergleichsmiete richtet sich nach § 558 BGB. Sie wird nur geschuldet, wenn der Mieter zustimmt oder ein Gericht sie zuspricht. Eine schriftliche, begründete Antwort kann die Berechnung bestreiten. Ein Musterschreiben dafür stellen wir nicht zum Download.",
          "Liegt die Miete weit über der Vergleichsmiete, kommen neben der Mietpreisbremse auch § 5 des Wirtschaftsstrafgesetzes und, in schweren Fällen, Wucher nach § 291 StGB in Betracht. Ob eine Grenze überschritten ist, hängt von der Vergleichsmiete und vom Einzelfall ab. Eine feste Euro-Schwelle nennen wir deshalb nicht.",
        ],
      },
    ],
    cta: { label: "Mietpreisbremse prüfen lassen", href: CASE_ANALYSIS_DE },
    related: [
      related("mietminderung", "Mietminderung bei Mängeln einordnen"),
      related("nebenkostenabrechnung", "Nebenkostenabrechnung getrennt von der Grundmiete prüfen"),
      related("mieterschutzverein-alternative", "Mieterverein als Ergänzung zur Ersteinschätzung"),
      { href: ENGLISH_HUB_PATH, label: "German rental dispute help in English" },
    ],
    faqs: [
      {
        question: "Gibt es einen Mietpreisbremse-Rechner auf dieser Seite?",
        answer:
          "Nein. Die zulässige Miete hängt von Verordnung, Vergleichsmiete und Ausnahmen ab. Ein Rechner, der eine Euro-Zahl auswirft, wäre ohne diese Daten unzuverlässig. Die Fallanalyse sortiert Ihren Vertrag.",
      },
      {
        question: "Gilt die 10-Prozent-Grenze überall in Deutschland?",
        answer:
          "Nein. § 556d BGB gilt nur in Gebieten, die das Land als angespannten Wohnungsmarkt ausgewiesen hat. Die Verordnung Ihres Landes entscheidet, nicht der Produktname Mietpreisbremse.",
      },
      {
        question: "Reicht es, die Miete zu hoch zu finden?",
        answer:
          "Für eine Rückzahlung verlangt § 556g BGB eine substantiierte Rüge. Zusätzlich müssen Ausnahmevorschriften wie Neubau, Vormiete oder umfassende Modernisierung geprüft werden.",
      },
      {
        question: "Wie widerspreche ich einer Mieterhöhung?",
        answer:
          "Eine Erhöhung nach § 558 BGB wird ohne Ihre Zustimmung oder ein Urteil nicht geschuldet. Antworten Sie schriftlich und konkret zur Vergleichsmiete und zur Kappungsgrenze. Ein allgemeines Muster ersetzt das nicht.",
      },
      {
        question: "Was ist Mietwucher?",
        answer:
          "Überhöhte Mieten können ordnungswidrig oder, bei Ausnutzung einer Zwangslage, strafbar sein. Die Schwelle hängt von der ortsüblichen Vergleichsmiete ab. Wir beziffern sie hier nicht pauschal.",
      },
    ],
    disclaimer: DISCLAIMER_DE,
  },
  {
    route: de("mietkaution"),
    title: "Mietkaution zurückfordern | TheLawThing",
    description:
      "Mietkaution zurückfordern, wenn der Vermieter nicht zahlt. Was § 551 BGB erlaubt. Ersteinschätzung starten.",
    h1: "Mietkaution zurückfordern",
    leadKeywords: ["Mietkaution zurückfordern", "Vermieter zahlt Kaution nicht zurück"],
    intro: [
      "Die Mietkaution zurückfordern wird zum Streit, wenn „Vermieter zahlt Kaution nicht zurück“ und kein nachvollziehbarer Einbehalt genannt ist. Zuerst zählen Höhe, Anlage und offene Forderungen, nicht ein pauschaler Auszahlungstag.",
      "TheLawThing liest Ihre Unterlagen als Ersteinschätzung. Wir nennen kein festes Datum, an dem die Kaution gesetzlich fällig wäre, weil das BGB keines in Tagen festlegt.",
    ],
    sections: [
      {
        h2: "Wie hoch darf die Mietkaution nach § 551 BGB sein?",
        paragraphs: [
          "§ 551 Abs. 1 BGB begrenzt eine Geldkaution auf drei Monatskaltmieten ohne die als Pauschale oder Vorauszahlung ausgewiesenen Betriebskosten. Eine höhere Vereinbarung ist unwirksam.",
          "Ist Ratenzahlung vereinbart oder üblich, ist die Kaution in drei gleichen monatlichen Raten zu zahlen. Die erste Rate wird zu Beginn des Mietverhältnisses fällig. Der Vermieter muss das Geld getrennt von seinem Vermögen zum üblichen Zinssatz für Spareinlagen anlegen.",
        ],
      },
      {
        h2: "Was gilt, wenn der Vermieter die Kaution nicht zurückzahlt?",
        paragraphs: [
          "Nach Ende des Mietverhältnisses darf der Vermieter einbehalten, was er für noch offene, begründete Ansprüche braucht, etwa für eine noch nicht fällige Nebenkostenabrechnung oder für konkrete Schäden. Einen festen gesetzlichen Rückzahlungstag in Tagen oder Monaten gibt es nicht. Geschuldet ist die Rückgabe innerhalb einer angemessenen Prüfungsfrist.",
          "Wenn der Vermieter zahlt die Kaution nicht zurück und keine Forderung benennt, fordern Sie schriftlich eine Abrechnung und die Auszahlung des unstreitigen Teils. Bewahren Sie Übergabeprotokoll, Fotos und die Zahlungsnachweise auf.",
          "Bleibt die Reaktion aus, kann ein Anspruch auf Rückzahlung vor dem Amtsgericht geltend gemacht werden. Ob sich das lohnt, hängt von Betrag, Einbehalt und Prozesskostenrisiko ab. Die Fallanalyse stellt Best, Base und Worst Case nebeneinander, ohne eine Erfolgsquote zu versprechen.",
        ],
      },
      {
        h2: "Darf ein Teil der Kaution für die Nebenkosten einbehalten werden?",
        paragraphs: [
          "Ein angemessener Einbehalt für noch nicht abgerechnete Betriebskosten wird von Gerichten oft akzeptiert. Der Rest ist auszuzahlen. Wie hoch der Einbehalt sein darf, richtet sich nach den bisherigen Abrechnungen und offenen Posten, nicht nach einer festen Formel auf dieser Seite.",
        ],
      },
    ],
    cta: { label: "Kaution in der Fallanalyse prüfen", href: CASE_ANALYSIS_DE },
    related: [
      related("nebenkostenabrechnung", "Nebenkostenabrechnung prüfen, bevor die Kaution einbehalten wird"),
      related("klage-amtsgericht-mietrecht", "Klage beim Amtsgericht und das Kostenrisiko"),
      related("mietminderung", "Mängel und Mietminderung während der Mietzeit"),
      { href: ENGLISH_HUB_PATH, label: "Landlord keeping the deposit in Germany" },
    ],
    faqs: [
      {
        question: "Nach wie vielen Tagen muss die Kaution zurückgezahlt werden?",
        answer:
          "Das BGB nennt keine Zahl von Tagen. Der Vermieter darf eine angemessene Zeit prüfen und begründete Forderungen einbehalten. Ein pauschales „30 Tage“-Versprechen wäre ungenau.",
      },
      {
        question: "Ist eine Kaution von mehr als drei Kaltmieten erlaubt?",
        answer:
          "Für eine Barkaution setzt § 551 Abs. 1 BGB die Grenze bei drei Nettokaltmieten. Betriebskostenvorauszahlungen zählen nicht mit.",
      },
      {
        question: "Was tun, wenn der Vermieter gar nicht antwortet?",
        answer:
          "Setzen Sie die Forderung schriftlich und heben Sie den Zugang auf. Danach kommt eine Klage vor dem Amtsgericht in Betracht. Vorher lohnt die Ersteinschätzung zu Betrag und Einbehalt.",
      },
      {
        question: "Bekomme ich Zinsen auf die Kaution?",
        answer:
          "§ 551 BGB verlangt eine Anlage zum üblichen Zinssatz für Spareinlagen, getrennt vom Vermögen des Vermieters. Der konkrete Satz hängt vom Anlagezeitraum ab. Wir nennen hier keinen Prozentsatz.",
      },
      {
        question: "Kann der Vermieter die gesamte Kaution ohne Begründung behalten?",
        answer:
          "Er braucht nachvollziehbare offene Ansprüche. Ein Einbehalt ohne jede Erklärung ist ein typischer Streitpunkt, aber noch kein automatischer voller Rückzahlungsanspruch.",
      },
    ],
    disclaimer: DISCLAIMER_DE,
  },
  {
    route: de("nebenkostenabrechnung"),
    title: "Nebenkostenabrechnung prüfen | TheLawThing",
    description:
      "Nebenkostenabrechnung prüfen lassen: 12-Monats-Frist, umlagefähige Kosten und Widerspruch. Ersteinschätzung starten.",
    h1: "Nebenkostenabrechnung prüfen lassen",
    leadKeywords: ["Nebenkostenabrechnung prüfen lassen", "Betriebskostenabrechnung Widerspruch"],
    intro: [
      "Eine Nebenkostenabrechnung prüfen lassen sollten Sie, bevor Sie eine Nachzahlung überweisen oder ein Guthaben als endgültig betrachten. Der Betriebskostenabrechnung Widerspruch muss konkret sein: welche Position, welcher Zeitraum, welcher Grund.",
      "TheLawThing bietet dafür eine KI-gestützte Ersteinschätzung Ihrer Unterlagen, keine Belegprüfung vor Ort und kein Musterschreiben.",
    ],
    sections: [
      {
        h2: "Welche Kosten dürfen überhaupt umgelegt werden?",
        paragraphs: [
          "Betriebskosten sind nur geschuldet, wenn das Mietverhältnis eine Umlage vorsieht. § 556 BGB verweist auf die Betriebskostenverordnung. Verwaltung, Instandhaltung und Instandsetzung gehören grundsätzlich nicht zu den umlagefähigen Betriebskosten.",
          "Eine Position, die im Vertrag nicht vereinbart ist, bleibt auch dann zweifelhaft, wenn sie auf der Abrechnung steht. Vergleichen Sie den Kostenkatalog im Vertrag mit der Abrechnung, Zeile für Zeile.",
        ],
      },
      {
        h2: "Welche Frist gilt für die Abrechnung des Vermieters?",
        paragraphs: [
          "§ 556 Abs. 3 BGB: Die Abrechnung ist spätestens bis zum Ablauf des zwölften Monats nach Ende des Abrechnungszeitraums mitzuteilen. Eine Nachforderung ist danach ausgeschlossen, wenn der Vermieter die Verspätung zu vertreten hat.",
          "Die Frist schützt nicht vor jeder Korrektur. Sie betrifft die Nachforderung des Vermieters. Ihr eigenes Guthaben und offene Einwendungen sind davon zu unterscheiden.",
        ],
      },
      {
        h2: "Wie sieht ein sachlicher Widerspruch gegen die Betriebskostenabrechnung aus?",
        paragraphs: [
          "Benennen Sie die Abrechnung, den Zeitraum und die Positionen, die Sie beanstanden. Typische Punkte sind ein falscher Verteilerschlüssel, nicht vereinbarte Kosten, rechnerische Fehler oder fehlende Gesamtkosten.",
          "Mieter haben nach der ständigen Gerichtspraxis in der Regel das Recht, Belege einzusehen. Wir nennen hier kein Aktenzeichen. Bitten Sie schriftlich um Einsicht, wenn die Abrechnung ohne Unterlagen nicht prüfbar ist.",
          "Ein Widerspruch-Muster zum Herunterladen gibt es auf dieser Seite nicht. Ein allgemeiner Text ohne Bezug zu Ihren Zahlen hilft im Streit wenig. Die Fallanalyse kann die offenen Punkte priorisieren.",
        ],
      },
    ],
    cta: { label: "Nebenkostenabrechnung jetzt prüfen", href: CASE_ANALYSIS_DE },
    related: [
      related("mietkaution", "Einbehalt der Mietkaution wegen offener Nebenkosten"),
      related("mietpreisbremse", "Grundmiete und Mietpreisbremse getrennt prüfen"),
      related("mietminderung", "Mängel sind keine Nebenkostenposition"),
      { href: ENGLISH_HUB_PATH, label: "Tenant rights Germany, including service charges" },
    ],
    faqs: [
      {
        question: "Muss ich jede Nachzahlung sofort zahlen?",
        answer:
          "Prüfen Sie zuerst Frist, Vertrag und Verteilerschlüssel. Eine verspätete Nachforderung kann nach § 556 Abs. 3 BGB ausgeschlossen sein, wenn der Vermieter die Verspätung zu vertreten hat.",
      },
      {
        question: "Wie widerspreche ich einer Betriebskostenabrechnung?",
        answer:
          "Schriftlich, mit Zeitraum und konkreten Positionen. Ein allgemeines Muster ohne Ihre Zahlen stellen wir nicht bereit.",
      },
      {
        question: "Darf der Vermieter Reparaturen umlegen?",
        answer:
          "Instandhaltung und Instandsetzung sind grundsätzlich keine Betriebskosten. Stehen sie trotzdem auf der Abrechnung, ist das ein typischer Prüfpunkt.",
      },
      {
        question: "Kann ich die Belege sehen?",
        answer:
          "Ja, die Einsicht in die Belege wird in der Gerichtspraxis regelmäßig zugestanden. Verlangen Sie sie schriftlich, wenn die Abrechnung sonst nicht nachvollziehbar ist.",
      },
      {
        question: "Ersetzt die Ersteinschätzung einen Steuerberater oder Anwalt?",
        answer:
          "Nein. Sie sortiert die Streitpunkte. Die rechtliche Bewertung einer einzelnen Position und ein Schriftsatz bleiben Sache einer zugelassenen Beratung, wenn Sie die brauchen.",
      },
    ],
    disclaimer: DISCLAIMER_DE,
  },
  {
    route: de("mietminderung"),
    title: "Mietminderung berechnen | TheLawThing",
    description:
      "Mietminderung berechnen ohne amtliche Tabelle: Mängel, Anzeige und § 536 BGB. Ersteinschätzung Ihrer Wohnung starten.",
    h1: "Mietminderung berechnen",
    leadKeywords: ["Mietminderung berechnen", "Mietminderung Tabelle", "Schimmel in der Wohnung Mietminderung"],
    intro: [
      "Mietminderung berechnen möchten viele anhand einer Mietminderung Tabelle. Eine amtliche Tabelle mit festen Prozentsätzen gibt es im BGB nicht. Bei Schimmel in der Wohnung Mietminderung hängt die Höhe davon ab, wie stark der Mangel die Tauglichkeit der Wohnung mindert.",
      "TheLawThing ersetzt die Tabelle nicht durch erfundene Prozentwerte. Die Ersteinschätzung ordnet Mangel, Anzeige und Zeitraum.",
    ],
    sections: [
      {
        h2: "Wann mindert sich die Miete nach § 536 BGB?",
        paragraphs: [
          "Ist die Wohnung bei Übergabe oder später mangelhaft und die Tauglichkeit zum vertragsgemäßen Gebrauch aufgehoben oder gemindert, ist der Mieter nach § 536 BGB für die Zeit des Mangels von der Miete befreit oder die Miete ist angemessen herabgesetzt. Die Minderung tritt kraft Gesetzes ein. Sie ist keine Kulanz des Vermieters.",
          "Eine unerhebliche Minderung bleibt außer Betracht. Was unerheblich ist, entscheidet sich am Mangel, nicht an einer Liste auf dieser Website. Feste Sätze für Schimmel, Lärm oder eine kalte Heizung veröffentlichen wir bewusst nicht.",
        ],
      },
      {
        h2: "Schimmel in der Wohnung: wann kommt eine Mietminderung in Betracht?",
        paragraphs: [
          "Schimmel kann ein Mangel sein, wenn die Ursache im Gebäude liegt, etwa in der Bausubstanz, in Wärmebrücken oder in einem unzureichenden Feuchteschutz. Liegt die Ursache allein in einem vertragswidrigen Heiz- und Lüftungsverhalten, kann die Minderung entfallen.",
          "Dokumentieren Sie Ausbreitung, Räume und Dauer mit Fotos und Daten. Die Ursache ist oft streitig. Eine Ersteinschätzung kann die Beweislage sortieren, sie ersetzt kein Gutachten.",
        ],
      },
      {
        h2: "Heizung ausgefallen: was bedeutet das für die Miete?",
        paragraphs: [
          "Eine ausgefallene Heizung kann die Tauglichkeit erheblich mindern, besonders in der Heizperiode und in Wohnräumen. Wie stark die Miete herabgesetzt ist, hängt von Dauer, betroffenen Räumen und Jahreszeit ab.",
          "Melden Sie den Ausfall sofort und notieren Sie, wann die Heizung wieder lief. Ohne Zeitraum lässt sich eine Minderung nicht einordnen. Einen Euro-Betrag rechnen wir hier nicht aus.",
        ],
      },
      {
        h2: "Wie zeigt man einen Mangel an, ohne ein Musterschreiben?",
        paragraphs: [
          "§ 536c BGB verpflichtet den Mieter, einen Mangel unverzüglich anzuzeigen. Die Anzeige sollte die Wohnung, den Mangel, den Zeitpunkt und die Bitte um Abhilfe nennen. Schriftform ist der sicherere Weg, auch wenn das Gesetz sie nicht immer verlangt.",
          "Eine Mängelanzeige als ausfüllbares Muster bieten wir nicht an. Ein Text ohne Ihren Sachverhalt wäre irreführend. Bleibt die Abhilfe aus, kann unter den Voraussetzungen des § 543 BGB auch eine außerordentliche Kündigung in Betracht kommen. Die Frist dafür hängt vom Mangel ab.",
        ],
      },
    ],
    cta: { label: "Mangel und Minderung analysieren", href: CASE_ANALYSIS_DE },
    related: [
      related("nebenkostenabrechnung", "Nebenkosten und Mängel nicht vermischen"),
      related("mietpreisbremse", "Zu hohe Anfangsmiete getrennt von der Minderung prüfen"),
      related("klage-amtsgericht-mietrecht", "Streit über die Miete vor dem Amtsgericht"),
      { href: ENGLISH_HUB_PATH, label: "Tenant rights Germany in English" },
    ],
    faqs: [
      {
        question: "Wo finde ich die amtliche Mietminderungstabelle?",
        answer:
          "Es gibt keine. § 536 BGB spricht von einer angemessenen Herabsetzung. Prozenttabellen im Internet sind Erfahrungswerte Dritter, keine Rechtsnorm. Wir übernehmen sie nicht.",
      },
      {
        question: "Muss ich die Miete weiter voll zahlen, bis der Vermieter zustimmt?",
        answer:
          "Die Minderung entsteht kraft Gesetzes, wenn ein Mangel vorliegt. Eine zu starke Kürzung kann aber selbst zum Streit und zu Zahlungsrückständen führen. Wie weit Sie kürzen, sollte zur Beeinträchtigung passen.",
      },
      {
        question: "Reicht ein Anruf beim Vermieter als Mängelanzeige?",
        answer:
          "Besser ist eine schriftliche Anzeige mit Datum, Raum und Beschreibung. So können Sie den Zugang später belegen. Ein Mustervordruck ist dafür nicht erforderlich.",
      },
      {
        question: "Gilt bei Schimmel immer eine Mietminderung?",
        answer:
          "Nur wenn ein Mangel die Tauglichkeit mindert. Bauliche Ursachen sprechen dafür, reines Fehlverhalten beim Heizen und Lüften kann dagegen sprechen. Die Ursache ist oft der Kern des Streits.",
      },
      {
        question: "Kann ich die Minderung in der Fallanalyse ausrechnen lassen?",
        answer:
          "Die Analyse beschreibt Szenarien zu Ihrem Sachverhalt. Sie gibt keine amtliche Prozentzahl aus. Dafür wäre eine Tabelle nötig, die das Gesetz nicht kennt.",
      },
    ],
    disclaimer: DISCLAIMER_DE,
  },
  {
    route: de("mieterschutzverein-alternative"),
    title: "Mieterschutzbund Alternative | TheLawThing",
    description:
      "Mieterschutzbund Alternative gesucht? Mieterverein und KI-Ersteinschätzung sachlich vergleichen. Fall analysieren.",
    h1: "Mieterschutzbund Alternative",
    leadKeywords: ["Mieterschutzbund Alternative", "Mieterverein Alternative", "Anwalt Mietrecht Kosten sparen"],
    intro: [
      "Wer eine Mieterschutzbund Alternative oder eine Mieterverein Alternative sucht, vergleicht meist Mitgliedschaft, Beratung und Kosten. TheLawThing ist keine davon: Es ist eine KI-gestützte Ersteinschätzung, mit der sich Anwalt Mietrecht Kosten sparen lässt, indem der Sachverhalt vorher geordnet ist.",
      "Der Vergleich ist sachlich. Ein Mieterverein bleibt für viele Menschen der richtige Ort für laufende Beratung und Vertretung.",
    ],
    sections: [
      {
        h2: "Was leistet ein Mieterverein typischerweise?",
        paragraphs: [
          "Örtliche Mietervereine, oft im Deutschen Mieterbund zusammengeschlossen, sind Mitgliedsorganisationen. Je nach Satzung bieten sie Beratung zum Mietvertrag, Hilfe bei Schreiben und manchmal Rechtsschutz oder die Vertretung durch eigene Juristinnen und Juristen.",
          "Leistungsumfang, Wartezeit und Mitgliedsbeitrag unterscheiden sich von Stadt zu Stadt. Wir nennen hier keinen Beitrag und keine Warteliste, weil beides nicht einheitlich ist. Fragen Sie den Verein an Ihrem Ort.",
        ],
      },
      {
        h2: "Was TheLawThing ist und was es nicht ist",
        paragraphs: [
          "TheLawThing sitzt in Berlin und richtet sich an Mieterinnen, Mieter und juristische Berufe. Sie laden Unterlagen hoch und erhalten eine strukturierte Ersteinschätzung mit Best Case, Base Case und Worst Case.",
          "Wir sind kein Mieterverein, kein Mieterschutzbund und keine Anwaltskanzlei. Wir werden nicht Mitglied in Ihrem Prozess und erteilen keine individuelle Rechtsberatung nach dem RDG. Wer eine Vertretung vor Gericht braucht, beauftragt eine Anwältin, einen Anwalt oder nutzt das Angebot eines Vereins.",
        ],
      },
      {
        h2: "Wann welche Hilfe passt, wenn Sie Anwaltskosten im Blick haben",
        paragraphs: [
          "Eine Ersteinschätzung ist sinnvoll, bevor Sie einen Termin bezahlen oder einen Mitgliedsbeitrag leisten, und Sie den Sachverhalt noch nicht sortiert haben. Ein Mieterverein oder ein Anwalt ist sinnvoll, wenn jemand für Sie schreiben, verhandeln oder klagen soll.",
          "Beides kann nacheinander passen. Die Analyse spart nicht automatisch einen bestimmten Eurobetrag. Sie kann den späteren Termin kürzer und genauer machen. Ob sich das rechnet, entscheiden Sie.",
        ],
      },
    ],
    cta: { label: "Ersteinschätzung statt Bauchgefühl starten", href: CASE_ANALYSIS_DE },
    related: [
      related("eigenbedarfskuendigung", "Eigenbedarfskündigung vor dem Gespräch einordnen"),
      related("mietkaution", "Streit um die Mietkaution vorbereiten"),
      related("klage-amtsgericht-mietrecht", "Prozesskostenrisiko vor einer Klage verstehen"),
      { href: ENGLISH_HUB_PATH, label: "Mieterverein help in English for Berlin, Munich and Frankfurt" },
    ],
    faqs: [
      {
        question: "Ist TheLawThing ein Mieterverein?",
        answer:
          "Nein. Mietervereine sind Mitgliedsorganisationen mit eigener Beratung. TheLawThing ist eine Software für eine KI-gestützte Ersteinschätzung.",
      },
      {
        question: "Ersetzt die Analyse die Mitgliedschaft im Mieterschutzbund?",
        answer:
          "Nein. Wer laufende Beratung, Rechtsschutz oder Vertretung sucht, fragt einen Verein oder eine Kanzlei. Die Analyse bereitet den Sachverhalt vor.",
      },
      {
        question: "Spare ich damit einen festen Anwaltsbetrag?",
        answer:
          "Das lässt sich nicht versprechen. Ein geordneter Sachverhalt kann einen späteren Termin fokussieren. Einen Eurobetrag nennen wir nicht.",
      },
      {
        question: "Können auch Anwältinnen und Anwälte das Werkzeug nutzen?",
        answer:
          "Ja. TheLawThing ist für Verbraucher und für juristische Berufe gedacht, als strukturierte Sicht auf Unterlagen und Szenarien, nicht als Ersatz der eigenen Mandatsprüfung.",
      },
      {
        question: "Berät TheLawThing nach dem RDG?",
        answer:
          "Nein. Die Seiten und die Analyse sind allgemeine Information und eine softwaregestützte Ersteinschätzung. Individuelle Rechtsberatung leisten zugelassene Berater.",
      },
    ],
    disclaimer: DISCLAIMER_DE,
  },
  {
    route: de("klage-amtsgericht-mietrecht"),
    title: "Klage beim Amtsgericht Mietrecht | TheLawThing",
    description:
      "Klage beim Amtsgericht im Mietrecht: Zuständigkeit, Räumungsklage und Kostenrisiko. Szenarien in der Analyse ansehen.",
    h1: "Klage beim Amtsgericht Mietrecht",
    leadKeywords: ["Klage beim Amtsgericht Mietrecht", "Räumungsklage was tun", "Vermieter verklagen ohne Anwalt"],
    intro: [
      "Eine Klage beim Amtsgericht Mietrecht ist für Wohnraum der gesetzliche Weg, nicht die freie Wahl des Gerichts. Räumungsklage was tun und den Vermieter verklagen ohne Anwalt sind dabei zwei verschiedene Lagen: Verteidigung gegen eine Räumung oder eine eigene Klage, etwa auf Rückzahlung der Kaution.",
      "TheLawThing zeigt in der Fallanalyse ein bestmögliches, ein mittleres und ein schwieriges Szenario. Das ist keine Gewinnquote und keine Prozesskostenrechnung in Euro.",
    ],
    sections: [
      {
        h2: "Welches Gericht ist für Wohnraummietstreitigkeiten zuständig?",
        paragraphs: [
          "Wohnraummietstreitigkeiten gehören unabhängig vom Streitwert vor das Amtsgericht, § 23 Nr. 2a Gerichtsverfassungsgesetz. Örtlich ist in der Regel das Gericht zuständig, in dessen Bezirk die Wohnräume liegen, § 29a Zivilprozessordnung.",
          "Eine Klage am eigenen Wohnort, obwohl die Wohnung woanders liegt, ist deshalb oft unzulässig. Prüfen Sie die Adresse der Wohnung, nicht die Adresse des Vermieters.",
        ],
      },
      {
        h2: "Kann ich den Vermieter ohne Anwalt verklagen?",
        paragraphs: [
          "Vor dem Amtsgericht besteht kein Anwaltszwang. § 78 Zivilprozessordnung verlangt eine Vertretung durch Anwälte vor dem Landgericht und in höheren Instanzen, nicht vor dem Amtsgericht. Sie können eine Wohnraumklage deshalb selbst erheben und selbst auf eine Klage erwidern.",
          "Ohne Anwalt bleiben Fristen, Zustellung und Beweisregeln Ihre Verantwortung. Die Ersteinschätzung sortiert Anspruchsgrund und Unterlagen. Sie schreibt keine Klageschrift.",
        ],
      },
      {
        h2: "Räumungsklage: was können Mieterinnen und Mieter prüfen?",
        paragraphs: [
          "Eine Räumungsklage verlangt Herausgabe der Wohnung, oft nach einer Kündigung. Prüfen Sie, ob die Kündigung formal trägt, ob die Frist gewahrt ist und ob ein Widerspruch nach § 574 BGB noch möglich ist. Bei Eigenbedarf gelten die Gründe aus § 573 BGB.",
          "Was tun heißt zuerst: Schreiben, Zugangsdaten und einen möglichen Härtegrund sichern. Eine Räumung abwehren lässt sich nicht mit einem allgemeinen Textbaustein. Reagieren Sie auf Zustellungen fristgerecht. Welche Frist in Ihrem Beschluss oder Ihrer Klageschrift steht, lesen Sie dort nach. Wir erfinden hier keine Wochenzahl.",
        ],
      },
      {
        h2: "Wie zeigt die Analyse Best Case, Base Case und Worst Case?",
        paragraphs: [
          "Die Fallanalyse legt drei Lesarten desselben Sachverhalts nebeneinander. Der Best Case ist die günstige Lesart Ihrer Unterlagen, der Base Case die mittlere, der Worst Case die schwierige, einschließlich eines ungünstigen Prozessausgangs.",
          "Das Prozesskostenrisiko folgt aus § 91 Zivilprozessordnung: Die unterliegende Partei trägt die Kosten des Rechtsstreits, also Gerichtskosten und die notwendigen Kosten der Gegenseite. Wie hoch die Gebühren sind, hängt vom Streitwert und davon ab, ob Anwälte beteiligt sind. Eine Gebührentabelle drucken wir hier nicht ab.",
          "Beratungshilfe und Prozesskostenhilfe können Menschen mit geringem Einkommen entlasten. Ob Sie sie erhalten, hängt von Einkommen, Vermögen und den Erfolgsaussichten ab. Die Grenzen stehen nicht auf dieser Seite.",
        ],
      },
    ],
    cta: { label: "Szenarien Ihrer Mietklage ansehen", href: CASE_ANALYSIS_DE },
    related: [
      related("eigenbedarfskuendigung", "Eigenbedarfskündigung vor einer Räumungsklage prüfen"),
      related("mietkaution", "Mietkaution einklagen: Anspruch zuerst ordnen"),
      related("mieterschutzverein-alternative", "Verein oder eigene Klage: den Unterschied verstehen"),
      { href: ENGLISH_HUB_PATH, label: "German rental dispute help in English" },
    ],
    faqs: [
      {
        question: "Muss ich für eine Mietklage zum Landgericht?",
        answer:
          "Wohnraummietstreitigkeiten sind beim Amtsgericht angesiedelt, unabhängig vom Betrag. Örtlich zählt in der Regel der Ort der Wohnung.",
      },
      {
        question: "Brauche ich vor dem Amtsgericht einen Anwalt?",
        answer:
          "Nein, ein Anwaltszwang besteht dort nicht. Sie können selbst klagen und sich selbst verteidigen. Ein Anwalt oder ein Mieterverein kann trotzdem sinnvoll sein.",
      },
      {
        question: "Was kostet eine verlorene Klage?",
        answer:
          "Nach § 91 ZPO trägt die unterliegende Seite die Kosten des Rechtsstreits. Den Betrag bestimmen Streitwert und beteiligte Anwälte. Eine Pauschale nennen wir nicht.",
      },
      {
        question: "Ist die Szenarioanalyse eine Gewinnwahrscheinlichkeit?",
        answer:
          "Nein. Best Case, Base Case und Worst Case sind drei Lesarten. Sie sind keine Quote und kein Richterspruch.",
      },
      {
        question: "Schreibt TheLawThing die Klageschrift?",
        answer:
          "Nein. Die Analyse bereitet den Sachverhalt auf. Schriftsätze und Vertretung bleiben bei Ihnen, einem Verein oder einer zugelassenen Anwaltskanzlei.",
      },
    ],
    disclaimer: DISCLAIMER_DE,
  },
  {
    route: de("germany-tenant-rights"),
    title: "Tenant rights Germany | TheLawThing",
    description:
      "Tenant rights Germany in English, including Berlin deposits and Eigenbedarf. Start an AI-assisted first look.",
    h1: "Tenant rights Germany",
    leadKeywords: ["Tenant rights Germany", "Tenant rights Berlin", "German rental dispute help in English"],
    intro: [
      "Tenant rights Germany are set out mainly in the Civil Code. Tenant rights Berlin follow those same national rules plus local measures such as a rent index. This page is German rental dispute help in English from TheLawThing in Berlin.",
      "It is an overview and an entry point to an AI-assisted first assessment. It is not a lawyer’s opinion on your lease.",
    ],
    sections: [
      {
        h2: "Which tenant rights matter in a German rental dispute?",
        paragraphs: [
          "Residential leases are governed largely by sections 535 onwards of the Bürgerliches Gesetzbuch (BGB). Rent is due in return for the apartment in a condition fit for the agreed use. Defects can reduce the rent under section 536. A cash deposit is capped at three months of net cold rent under section 551.",
          "Landlords need a legitimate interest to end an open-ended lease under section 573. Personal use, called Eigenbedarf, is one of the listed interests. Notice periods are in section 574’s neighbourhood, specifically section 573c, and tenants can object to hardship under section 574.",
        ],
      },
      {
        h2: "What is an Eigenbedarf eviction in Germany?",
        paragraphs: [
          "Eigenbedarf eviction Germany is the shorthand for a termination because the landlord needs the home for themselves, their family, or a member of their household. The reasons have to be stated in the notice. A pretextual need can make the termination invalid.",
          "The German guide on this site walks through sections 573, 573c and 574 in more detail: Eigenbedarfskündigung prüfen.",
        ],
      },
      {
        h2: "What if the landlord is keeping the deposit?",
        paragraphs: [
          "A landlord keeping the deposit in Germany may hold back amounts that cover real, outstanding claims, including a reasonable reserve for a service-charge bill that is not ready. The statute does not set a number of days for the refund. After a reasonable review period, the rest of the Kaution should be paid back.",
          "If nothing is explained, ask in writing for an itemised retention and payment of the balance. The German page Mietkaution zurückfordern covers section 551 without inventing a payout deadline.",
        ],
      },
      {
        h2: "Is there a Mieterverein in English in Berlin, Munich or Frankfurt?",
        paragraphs: [
          "Local tenant associations (Mieterverein, sometimes called a Mieterschutzbund) advise members in German. English-language appointments in Berlin, Munich and Frankfurt exist only where that local association or a local lawyer offers them. Coverage changes, so ask the association in that city directly. We do not claim that any named club currently advises in English.",
          "TheLawThing’s English interface is a different kind of help: an AI-assisted first look at your documents and a best case, a base case, and a worst case. It does not join your case, insure you, or replace a Mieterverein.",
        ],
      },
      {
        h2: "How does the outcome simulator describe best, base and worst case?",
        paragraphs: [
          "The case analysis does not publish a win rate. It sets the same facts out three ways. The best case is the favourable reading, the base case the middle reading, and the worst case the difficult one, including losing and bearing the other side’s necessary costs under section 91 of the Code of Civil Procedure.",
          "Court cases about a home are brought in the local Amtsgericht for the district where the apartment is, and a lawyer is not mandatory there. The German court guide explains that path.",
        ],
      },
    ],
    cta: { label: "Review your German tenancy dispute", href: CASE_ANALYSIS_EN },
    related: [
      related("eigenbedarfskuendigung", "Eigenbedarfskündigung prüfen (personal-use termination)"),
      related("mietkaution", "Mietkaution zurückfordern (deposit refund)"),
      related("mietpreisbremse", "Mietpreisbremse prüfen (rent cap at the start of a lease)"),
      related("klage-amtsgericht-mietrecht", "Klage beim Amtsgericht Mietrecht (local court claims)"),
      { href: GERMAN_HOME_PATH, label: "Mietrecht Beratung online auf Deutsch" },
    ],
    faqs: [
      {
        question: "Do Berlin tenant rights differ from the rest of Germany?",
        answer:
          "The Civil Code applies nationwide. Berlin adds local instruments, such as a rent index and, when a state ordinance is in force, areas covered by the rent brake. Check the current ordinance rather than assuming it never expires.",
      },
      {
        question: "Can I stop an Eigenbedarf notice with this page?",
        answer:
          "No. The page explains the statute. An objection depends on your notice, the deadline, and any hardship. Use the case analysis to organise the facts, then a German-licensed lawyer or a tenant association if you need representation.",
      },
      {
        question: "Will a Mieterverein in Munich or Frankfurt speak English?",
        answer:
          "Some appointments are offered in English and many are not. Ask the local association. TheLawThing does not speak for those organisations.",
      },
      {
        question: "How fast must my landlord return the Kaution?",
        answer:
          "There is no fixed number of days in the Civil Code. The landlord may take a reasonable time and may retain justified claims. The balance should then be returned.",
      },
      {
        question: "Is this legal advice for my lease?",
        answer:
          "No. It is general information and, if you continue into the product, an AI-assisted first assessment. It does not replace a lawyer licensed in Germany.",
      },
    ],
    disclaimer: DISCLAIMER_EN,
  },
];

export function getTenancyGuide(country: string, locale: string, slug: string): TenancyGuide | undefined {
  return TENANCY_GUIDES.find(
    (guide) => guide.route.country === country && guide.route.locale === locale && guide.route.slug === slug,
  );
}

export function tenancyStaticParams(): { country: string; locale: string; topic: string }[] {
  return TENANCY_GUIDES.map((guide) => ({
    country: guide.route.country,
    locale: guide.route.locale,
    topic: guide.route.slug,
  }));
}

export function tenancyMetadata(guide: TenancyGuide) {
  const enPath = guide.route.locale === "en" ? guide.route.publicPath : ENGLISH_HUB_PATH;
  const dePath = guide.route.locale === "de" ? guide.route.publicPath : GERMAN_HOME_PATH;
  const xDefault = ENGLISH_HUB_PATH;
  return {
    title: { absolute: guide.title },
    description: guide.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: absoluteUrl(guide.route.publicPath),
      languages: hreflangLanguages(dePath, enPath, xDefault),
    },
  };
}

export const GERMAN_HOME_SEO = {
  title: "Mietrecht Beratung online | TheLawThing",
  description:
    "Mietrecht Beratung online mit KI: Ersteinschätzung zu Mietstreitigkeiten. Erfolgsaussichten prüfen, bevor Sie einen Anwalt beauftragen.",
  h1: "Mietrecht Beratung online",
  leadKeywords: [
    "Mietrecht Beratung online",
    "KI Mietrecht",
    "Mietrecht Ersteinschätzung online",
    "Anwalt Mietrecht Kosten sparen",
  ],
  canonicalPath: GERMAN_HOME_PATH,
  faqs: [
    {
      question: "Was ist eine Mietrecht Ersteinschätzung online?",
      answer:
        "Eine softwaregestützte Einordnung Ihrer Unterlagen und des Sachverhalts. Sie zeigt Szenarien und offene Punkte. Sie ist keine individuelle Rechtsberatung.",
    },
    {
      question: "Ersetzt KI Mietrecht einen Anwalt oder einen Mieterverein?",
      answer:
        "Nein. TheLawThing bereitet den Streit vor. Vertretung, Mitgliedschaft und anwaltliche Beratung bleiben bei Kanzleien und Vereinen.",
    },
    {
      question: "Für welche Streitigkeiten ist die deutsche Startseite gedacht?",
      answer:
        "Für Mietstreitigkeiten in Deutschland, unter anderem Eigenbedarf, Kaution, Nebenkosten, Mietpreisbremse und Mietminderung. Die einzelnen Themen haben eigene Seiten.",
    },
    {
      question: "Kann ich die Erfolgsaussichten prüfen, bevor ich jemanden beauftrage?",
      answer:
        "Die Fallanalyse stellt einen günstigen, einen mittleren und einen schwierigen Verlauf gegenüber. Das ist keine Gewinnquote und kein Kostenangebot.",
    },
    {
      question: "Gilt das auch für Berlin?",
      answer:
        "Das BGB gilt bundesweit, auch in Berlin. Örtliche Regeln wie Mietspiegel oder eine Landesverordnung zur Mietpreisbremse müssen zusätzlich im aktuellen Stand geprüft werden.",
    },
  ] satisfies GuideFaq[],
};

export function germanHomeMetadata() {
  return {
    title: { absolute: GERMAN_HOME_SEO.title },
    description: GERMAN_HOME_SEO.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: absoluteUrl(GERMAN_HOME_PATH),
      languages: hreflangLanguages(GERMAN_HOME_PATH, ENGLISH_HOME_PATH, ENGLISH_HOME_PATH),
    },
  };
}

export function englishHomeMetadata() {
  return {
    robots: { index: true, follow: true },
    alternates: {
      canonical: absoluteUrl(ENGLISH_HOME_PATH),
      languages: hreflangLanguages(GERMAN_HOME_PATH, ENGLISH_HOME_PATH, ENGLISH_HOME_PATH),
    },
  };
}

/** Keyword promises that this change does not implement as tools or templates. */
export const SEO_DEFERRED = [
  {
    keyword: "Mietpreisbremse Rechner / Mietpreisbremse berechnen",
    reason: "No calculator. The page explains §§ 556d ff. BGB and sends the CTA to case analysis.",
  },
  {
    keyword: "Mietspiegel prüfen as an automated lookup",
    reason: "No city rent-index database. The page tells readers to use their local Mietspiegel.",
  },
  {
    keyword: "Widerspruch Eigenbedarfskündigung Muster",
    reason: "No downloadable template. The page explains §§ 574 and 574b BGB.",
  },
  {
    keyword: "Mieterhöhung widersprechen Muster",
    reason: "No template. The page explains that a § 558 increase needs consent or a judgment.",
  },
  {
    keyword: "Mietminderung Tabelle",
    reason: "No percentage table. The page states that § 536 BGB has no official table.",
  },
  {
    keyword: "Mängelanzeige Vermieter Muster",
    reason: "No fill-in form. The page describes what a defect notice should contain.",
  },
  {
    keyword: "Betriebskostenabrechnung Widerspruch as a template",
    reason: "No template. The page describes a specific written objection.",
  },
] as const;
