import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { UsersTable } from "./_components/users-table";
import { Role } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

interface SerializedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  point: number;
  deactivated: boolean;
  role: Role;
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
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        point: true,
        deactivated: true,
        role: true,
      }
    }),
    prisma.user.count(),
  ]);

  const serializedUsers: SerializedUser[] = users.map(user => ({
    id: String(user.id),
    name: String(user.name),
    email: String(user.email),
    phone: String(user.phone),
    point: Number(user.point || 0),
    deactivated: Boolean(user.deactivated),
    role: user.role,
  }));

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">회원 관리</h1>
      </div>
      <UsersTable 
        users={serializedUsers} 
        currentPage={page} 
        totalPages={totalPages} 
      />
    </div>
  );
}
