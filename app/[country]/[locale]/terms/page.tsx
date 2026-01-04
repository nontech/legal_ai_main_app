import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Terms of Service - TheLawThing",
  description: "Terms of Service for TheLawThing legal AI platform",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-surface-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-ink-900 mb-4">Terms of Service</h1>
          <p className="text-sm text-ink-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using TheLawThing's AI-powered legal case analysis platform (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">2. Important Disclaimer</h2>
              <div className="bg-warning-100 border-l-4 border-warning-500 p-4 my-4">
                <p className="font-semibold text-ink-900 mb-2">TheLawThing is not a law firm and does not provide legal advice.</p>
                <p>
                  The Service provides AI-generated analysis, predictions, and insights based on patterns in legal data. All outputs are assistive tools intended to support professional judgment, not replace it. Results are non-deterministic and should be reviewed by qualified legal counsel. You are solely responsible for all legal decisions and actions taken based on the Service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">3. Account Registration</h2>
              <p>To use the Service, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years old</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">4. Use of the Service</h2>
              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">4.1 Permitted Use</h3>
              <p>You may use the Service for lawful business purposes related to legal case analysis and research.</p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">4.2 Prohibited Uses</h3>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Upload content you do not have rights to</li>
                <li>Attempt to reverse engineer or extract AI model weights</li>
                <li>Use the Service for fraud, harassment, or discrimination</li>
                <li>Process special category data (e.g., health information) without authorization</li>
                <li>Create automated legal decisions without human oversight</li>
                <li>Interfere with or disrupt the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">5. Intellectual Property</h2>
              <p>
                The Service, including all software, algorithms, and content, is owned by TheLawThing and protected by intellectual property laws. You retain ownership of content you upload, but grant us a license to use it to provide the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">6. Data and Privacy</h2>
              <p>
                Your use of the Service is also governed by our Privacy Policy. We do not use your case data to train public AI models. Your data is isolated to your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">7. Service Availability</h2>
              <p>
                We strive to maintain Service availability but do not guarantee uninterrupted access. We may modify, suspend, or discontinue the Service at any time with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">8. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, TheLawThing SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">9. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless TheLawThing from any claims, damages, losses, or expenses (including attorneys' fees) arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">10. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">11. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of material changes. Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">13. Contact</h2>
              <p>
                Questions about these Terms? Contact us at <a href="mailto:legal@TheLawThing.dev" className="text-primary-600 hover:underline">legal@TheLawThing.dev</a>.
              </p>
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

