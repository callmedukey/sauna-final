"use client";

import AdminNav from "./nav";

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AdminNav />
      {children}
    </div>
  );
} 