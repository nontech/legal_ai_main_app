"use client";

import Link from "next/link";

interface NavbarProps {
  onPretrialClick?: () => void;
}

export default function Navbar({ onPretrialClick }: NavbarProps) {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
          >
            <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                Legal Case Analysis
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onPretrialClick}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:scale-105"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <span>Pretrial Process</span>
            </button>

            <Link
              href="/documents"
              className="relative px-4 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 group"
            >
              <span className="relative z-10">Documents Library</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <button className="relative px-4 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 group">
              <span className="relative z-10">Login</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 group-hover:w-full transition-all duration-300"></span>
            </button>

            <div className="ml-2 pl-2 border-l border-gray-200">
              <button className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
