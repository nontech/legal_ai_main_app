import Navbar from "./components/Navbar";
import ProgressStepper from "./components/ProgressStepper";
import JurisdictionSection from "./components/JurisdictionSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ProgressStepper />

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JurisdictionSection />
      </main>
    </div>
  );
}
