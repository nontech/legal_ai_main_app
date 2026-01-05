import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Imprint - TheLawThing",
  description: "Legal notice and imprint for TheLawThing",
};

export default function Imprint() {
  return (
    <div className="min-h-screen bg-surface-100">
      <Navbar />
      
      {/* Hero Header */}
      <div className="bg-primary-900 text-white pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Imprint / Legal Notice</h1>
          <p className="text-primary-100 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-border-200">
          <div className="prose prose-lg max-w-none space-y-8 text-ink-700">
            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Provider Information</h2>
              <p>
                <strong>Legal Entity Name:</strong> TheLawThing<br />
                <strong>Registered Office:</strong> [To be updated with actual address]<br />
                <strong>Postal Code & City:</strong> [To be updated]<br />
                <strong>Country:</strong> [To be updated]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Commercial Register</h2>
              <p>
                <strong>Register Court:</strong> [To be updated]<br />
                <strong>Registration Number:</strong> [To be updated]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">VAT Identification</h2>
              <p>
                <strong>VAT ID:</strong> [To be updated]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Managing Directors / Authorized Representatives</h2>
              <p>
                [To be updated with names of authorized representatives]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Contact Information</h2>
              <p>
                <strong>Email:</strong> <a href="mailto:contact@TheLawThing.dev" className="text-primary-600 hover:underline">contact@TheLawThing.dev</a><br />
                <strong>Support:</strong> <a href="mailto:support@TheLawThing.dev" className="text-primary-600 hover:underline">support@TheLawThing.dev</a><br />
                <strong>Phone:</strong> [To be updated]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Supervisory Authority</h2>
              <p>
                [To be updated if applicable]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Disclaimer</h2>
              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Liability for Content</h3>
              <p>
                As a service provider, we are responsible for our own content on these pages in accordance with general law. However, we are not under obligation to monitor third-party information transmitted or stored, or to investigate circumstances that indicate illegal activity.
              </p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">Liability for Links</h3>
              <p>
                Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the contents of the linked pages.
              </p>

              <h3 className="text-xl font-semibold text-ink-900 mt-6 mb-3">No Legal Advice</h3>
              <p>
                TheLawThing is not a law firm and does not provide legal advice. The Service provides AI-generated analysis and insights for informational purposes only. All legal decisions should be made in consultation with qualified legal counsel.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-4">Copyright</h2>
              <p>
                The content and works created by the site operators on these pages are subject to copyright law. Duplication, processing, distribution, and any form of commercialization of such material beyond the scope of the copyright law shall require the prior written consent of its respective author or creator.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border-200">
            <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group">
              <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
