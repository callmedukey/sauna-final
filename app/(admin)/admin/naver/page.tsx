import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import prisma from "@/lib/prisma";
import { NaverReservationsTable } from "./_components/naver-reservations-table";
import { CreateReservationDialog } from "./_components/create-reservation-dialog";

export default async function NaverReservationsPage() {
  // Get current time in KST
  const kstTime = toZonedTime(new Date(), "Asia/Seoul");
  const koreanDate = format(kstTime, "yyyy/MM/dd");

  const reservations = await prisma.naverReservation.findMany({
    where: {
      date: koreanDate,
    },
    orderBy: [
      {
        time: "asc",
      },
    ],
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">네이버 예약</h1>
          <CreateReservationDialog />
        </div>
        <div className="flex justify-end">
          <p className="text-sm text-muted-foreground">
            {format(kstTime, "yyyy년 MM월 dd일")} 예약 현황
          </p>
        </div>
      </div>
      <NaverReservationsTable reservations={reservations} />
    </main>
  );
}
