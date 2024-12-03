import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminClientLayout from "./client-layout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  return <AdminClientLayout>{children}</AdminClientLayout>;
}
