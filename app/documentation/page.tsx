import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Documentation - Lawgorithm",
  description: "Documentation for Lawgorithm legal AI platform",
};

export default function Documentation() {
  return (
    <div className="min-h-screen bg-surface-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-ink-900 mb-4">Documentation</h1>
          <p className="text-lg text-ink-600 mb-8">
            Learn how to use Lawgorithm's AI-powered scenario engine for legal case analysis.
          </p>

          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Getting Started</h2>
              <p>
                Lawgorithm is a scenario engine that analyzes your case facts and documents to produce structured scenario analyses. This guide will help you get started.
              </p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Creating Your First Analysis</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Start a New Case:</strong> Click "Start New Analysis" from the dashboard</li>
                <li><strong>Upload Documents:</strong> Upload case documents, pleadings, and relevant materials</li>
                <li><strong>Enter Case Facts:</strong> Provide key case details including jurisdiction, case type, and relevant facts</li>
                <li><strong>Review Analysis:</strong> Lawgorithm will generate scenario breakdowns, viability assessments, and actionable next steps</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Understanding Your Results</h2>
              
              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Viability Assessment</h3>
              <p>
                Each claim or issue receives a risk assessment:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Favorable:</strong> Strong legal position with supporting evidence</li>
                <li><strong>Uncertain:</strong> Mixed factors requiring further investigation</li>
                <li><strong>High-Risk:</strong> Significant challenges or weaknesses identified</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Scenario Breakdowns</h3>
              <p>
                Lawgorithm provides three scenario analyses:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Best-Case:</strong> Most favorable outcome based on available evidence</li>
                <li><strong>Base-Case:</strong> Most likely outcome given current facts</li>
                <li><strong>Worst-Case:</strong> Least favorable but plausible outcome</li>
              </ul>
              <p className="mt-4">
                Each scenario includes qualitative reasoning explaining the logic behind the prediction.
              </p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Actionable Next Steps</h3>
              <p>
                The system generates checklists including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Missing documents that could strengthen your case</li>
                <li>Suggested lines of legal research</li>
                <li>Questions to clarify with clients or witnesses</li>
                <li>Potential evidence to gather</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Document Management</h2>
              <p>
                Organize and manage your case documents in the Document Library:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upload documents in various formats (PDF, DOCX, etc.)</li>
                <li>Organize documents by case or category</li>
                <li>Use document classification to automatically categorize files</li>
                <li>Generate summaries for quick document review</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Best Practices</h2>
              
              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Data Quality</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide complete and accurate case facts</li>
                <li>Upload all relevant documents for comprehensive analysis</li>
                <li>Update case information as new facts emerge</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Review and Validation</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Always review AI-generated analyses with professional judgment</li>
                <li>Verify citations and legal references</li>
                <li>Consider multiple scenarios when making strategic decisions</li>
                <li>Consult with qualified legal counsel for final decisions</li>
              </ul>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Privacy and Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Only upload documents you have rights to process</li>
                <li>Be mindful of client confidentiality obligations</li>
                <li>Review our Privacy Policy and Security page for data handling details</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Limitations and Disclaimers</h2>
              <div className="bg-warning-100 border-l-4 border-warning-500 p-4 my-4">
                <p className="font-semibold text-ink-900 mb-2">Important:</p>
                <p>
                  Lawgorithm is not a law firm and does not provide legal advice. All outputs are assistive tools intended to support professional judgment. Results are non-deterministic and should be reviewed by qualified counsel. You are solely responsible for all legal decisions and actions.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Need Help?</h2>
              <p>
                If you have questions or need assistance, please contact our support team:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Email:</strong> <a href="mailto:support@lawgorithm.dev" className="text-primary-600 hover:underline">support@lawgorithm.dev</a></li>
                <li><strong>Response Time:</strong> We typically respond within 24-48 hours</li>
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
