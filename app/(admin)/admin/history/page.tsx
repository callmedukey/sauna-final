import { format, addDays, subDays } from "date-fns";

import prisma from "@/lib/prisma";
import { HistoryTable } from "./_components/history-table";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { SearchForm } from "./_components/search-form";

const ITEMS_PER_PAGE = 100;

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const searchParamsAwaited = await searchParams;
  const today = new Date();
  const defaultStartDate = format(today, "yyyy-MM-dd");
  const defaultEndDate = format(addDays(today, 30), "yyyy-MM-dd");

  const name = searchParamsAwaited.name || "";
  const startDate = searchParamsAwaited.startDate || defaultStartDate;
  const endDate = searchParamsAwaited.endDate || defaultEndDate;

  const currentPage = Number(searchParamsAwaited.page) || 1;

  // Build where clause for both queries
  const dateFilter = {
    date: {
      gte: startDate,
      lte: endDate,
    },
  };

  // Get total counts for pagination
  const [regularCount, naverCount] = await Promise.all([
    prisma.reservation.count({
      where: {
        ...dateFilter,
        ...(name ? { user: { name: { contains: name } } } : {}),
      },
    }),
    prisma.naverReservation.count({
      where: {
        ...dateFilter,
        ...(name ? { name: { contains: name } } : {}),
      },
    }),
  ]);

  const totalPages = Math.ceil((regularCount + naverCount) / ITEMS_PER_PAGE);

  // Fetch regular reservations
  const regularReservations = await prisma.reservation.findMany({
    where: {
      ...dateFilter,
      ...(name ? { user: { name: { contains: name } } } : {}),
    },
    include: {
      user: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
    orderBy: [
      {
        date: "desc",
      },
      {
        time: "asc",
      },
      {
        roomType: "asc",
      },
    ],
    take: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  // Fetch Naver reservations
  const naverReservations = await prisma.naverReservation.findMany({
    where: {
      ...dateFilter,
      ...(name ? { name: { contains: name } } : {}),
    },
    orderBy: [
      {
        date: "desc",
      },
      {
        time: "asc",
      },
    ],
    take: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">전체 내역</h1>
        </div>
        <SearchForm />
      </div>
      <HistoryTable
        regularReservations={regularReservations}
        naverReservations={naverReservations}
      />
      <div className="mt-6">
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/admin/history"
        />
      </div>
    </main>
  );
}
