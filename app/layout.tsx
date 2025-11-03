import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Legal Case Analysis - AI-Powered Legal Research",
  description:
    "Intelligent legal case analysis platform with AI-powered insights, document management, and case law research.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
