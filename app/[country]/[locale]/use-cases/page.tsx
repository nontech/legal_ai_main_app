import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Use Cases - TheLawThing",
  description: "Use cases for TheLawThing legal AI platform",
};

export default function UseCases() {
  return (
    <div className="min-h-screen bg-surface-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-ink-900 mb-4">Use Cases</h1>
          <p className="text-lg text-ink-600 mb-8">
            Discover how TheLawThing helps legal professionals make better strategic decisions.
          </p>

          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Case Strategy Development</h2>
              <p>
                Before committing significant resources to a case, use TheLawThing to assess viability and explore potential outcomes. Get structured scenario analyses that help you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Evaluate the strength of your legal position</li>
                <li>Identify key uncertainties and evidence gaps</li>
                <li>Understand best-case, base-case, and worst-case scenarios</li>
                <li>Make informed decisions about case acceptance and resource allocation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Client Communication</h2>
              <p>
                Help clients understand their case prospects with clear, explainable scenario breakdowns. TheLawThing provides:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Qualitative reasoning that you can explain to clients</li>
                <li>Risk assessments that set realistic expectations</li>
                <li>Actionable next steps that show proactive case management</li>
                <li>Evidence checklists that demonstrate thorough preparation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Document Review and Organization</h2>
              <p>
                Streamline document management with AI-powered classification and summarization:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Automatically classify documents by type and relevance</li>
                <li>Generate summaries for quick document review</li>
                <li>Identify missing documents that could strengthen your case</li>
                <li>Organize case materials efficiently</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Settlement Evaluation</h2>
              <p>
                When evaluating settlement offers, use scenario analyses to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Compare settlement terms against likely trial outcomes</li>
                <li>Assess the probability of different scenarios</li>
                <li>Identify factors that could improve or worsen your position</li>
                <li>Make data-informed settlement recommendations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Legal Research Planning</h2>
              <p>
                Get targeted research suggestions based on your case facts:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Identify key legal issues to research</li>
                <li>Suggest relevant case law and precedents to review</li>
                <li>Highlight jurisdictional considerations</li>
                <li>Prioritize research efforts based on case impact</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Risk Management</h2>
              <p>
                Proactively identify and address case risks:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Early identification of high-risk claims or issues</li>
                <li>Gap analysis for missing evidence or documentation</li>
                <li>Client communication checklists to clarify facts</li>
                <li>Strategic planning to mitigate identified risks</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border-200">
            <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

