import { redirect } from "next/navigation";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

import { UsersTable } from "./_components/users-table";
import { SearchForm } from "./_components/search-form";
import { PaginationBar } from "@/components/ui/pagination-bar";

const ITEMS_PER_PAGE = 100;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/");
  }
  const searchParamsAwaited = await searchParams;
  const name = searchParamsAwaited.name || "";
  const currentPage = Number(searchParamsAwaited.page) || 1;

  const users = await prisma.user.findMany({
    where: {
      name: name ? { contains: name } : undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      point: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  const totalUsers = await prisma.user.count({
    where: {
      name: name ? { contains: name } : undefined,
    },
  });

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">회원 관리</h1>
        </div>
        <SearchForm />
      </div>
      <UsersTable users={users} />
      <div className="mt-6">
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/admin/users"
        />
      </div>
    </main>
  );
}
