import { Suspense } from "react";
import Navbar from "./Navbar";

export default function NavbarWrapper(props: React.ComponentProps<typeof Navbar>) {
  return (
    <Suspense fallback={<div className="h-20" />}>
      <Navbar {...props} />
    </Suspense>
  );
}

