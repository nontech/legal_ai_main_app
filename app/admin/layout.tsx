"use client";

import { Toaster } from "../components/ui/toaster";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-panel">
      {children}
      <Toaster />
    </div>
  );
}
