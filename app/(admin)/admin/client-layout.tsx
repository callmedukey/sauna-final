"use client";

import AdminNav from "./nav";

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-24">
      <AdminNav />
      <div className="container mx-auto px-4">
        {children}
      </div>
    </div>
  );
} 