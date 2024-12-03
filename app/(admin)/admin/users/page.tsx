import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { UsersTable } from "./_components/users-table";

interface PageProps {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  const searchParamsAwaited = await searchParams;
  const page = Number(searchParamsAwaited.page) || 1;
  const limit = 20;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">회원 관리</h1>
      </div>
      <UsersTable users={users} currentPage={page} totalPages={totalPages} />
    </div>
  );
}
