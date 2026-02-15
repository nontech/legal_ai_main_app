import { Suspense } from "react";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  return (
    <Suspense fallback={<div className="h-20" />}>
      <Navbar />
    </Suspense>
  );
}

