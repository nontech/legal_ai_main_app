import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Cookie Policy - TheLawThing",
  description: "Cookie Policy for TheLawThing legal AI platform",
};

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-surface-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-ink-900 mb-4">Cookie Policy</h1>
          <p className="text-sm text-ink-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">2. Types of Cookies We Use</h2>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">2.1 Strictly Necessary Cookies</h3>
              <p>
                These cookies are essential for the Service to function properly. They enable core functionality such as authentication, security, and load balancing. You cannot opt out of these cookies.
              </p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">2.2 Functional Cookies</h3>
              <p>
                These cookies allow the Service to remember choices you make (such as language preferences) and provide enhanced, personalized features.
              </p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">2.3 Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with the Service by collecting and reporting information anonymously. This helps us improve the Service's performance and user experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">3. Your Cookie Choices</h2>
              <p>
                You can control and manage cookies through:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookie Settings:</strong> Use the "Cookie Settings" link in the footer to accept, reject, or fine-tune cookie categories at any time.</li>
                <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies. However, this may impact your ability to use the Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">4. Cookie Duration</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Session Cookies:</strong> Expire when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device until their set expiry date or until you delete them</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">5. Third-Party Cookies</h2>
              <p>
                Some cookies are set by third-party providers integrated into the Service (e.g., analytics services). We contractually require these providers to maintain appropriate privacy protections.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">6. Do Not Track</h2>
              <p>
                Our Service currently does not respond to "Do Not Track" (DNT) signals from browsers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">7. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. We will notify you of any material changes by posting the updated policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">8. Contact Us</h2>
              <p>
                If you have questions about our use of cookies, please contact us at <a href="mailto:privacy@TheLawThing.dev" className="text-primary-600 hover:underline">privacy@TheLawThing.dev</a>.
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

