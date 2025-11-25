"use client";

import { Suspense } from "react";
import VerdictStep from "@/app/components/VerdictStep";

function VerdictPageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <VerdictStep />
      </div>
    </div>
  );
}

function SuspenseFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading verdict page...</p>
      </div>
    </div>
  );
}

export default function VerdictPage() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <VerdictPageContent />
    </Suspense>
  );
}

