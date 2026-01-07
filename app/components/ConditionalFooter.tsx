"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on case-analysis pages
  if (pathname?.includes("/case-analysis")) {
    return null;
  }
  
  return <Footer />;
}

