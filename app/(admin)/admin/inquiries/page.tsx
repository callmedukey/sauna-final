import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { InquiriesTable } from "./_components/inquiries-table";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function AdminInquiriesPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  const searchParamsAwaited = await searchParams;
  const page = Number(searchParamsAwaited.page) || 1;
  const limit = 20;

  const [inquiries, total] = await Promise.all([
    prisma.inquiry.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.inquiry.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">문의 관리</h1>
      </div>
      <InquiriesTable
        inquiries={inquiries}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
