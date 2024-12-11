import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import prisma from "@/lib/prisma";

import { ReservationsTable } from "./_components/reservations-table";

export default async function ReservationsPage() {
  // Get current time in KST
  const kstTime = toZonedTime(new Date(), "Asia/Seoul");
  const koreanDate = format(kstTime, "yyyy/MM/dd");

  const reservations = await prisma.reservation.findMany({
    where: {
      date: koreanDate,
      canceled: false,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: [
      {
        roomType: "asc",
      },
      {
        time: "asc",
      },
    ],
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">예약 관리</h1>
        <p className="text-sm text-muted-foreground">
          {format(kstTime, "yyyy년 MM월 dd일")} 예약 현황
        </p>
      </div>
      <ReservationsTable reservations={reservations} />
    </main>
  );
}
