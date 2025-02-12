import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

import ReservationClient from "./_components/ReservationClient";

const KOREAN_TIMEZONE = "Asia/Seoul";

const ReservationPage = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const now = new Date();
  const koreaDate = toZonedTime(now, KOREAN_TIMEZONE);
  const todayInKorea = format(koreaDate, "yyyy/MM/dd");

  const [normalReservations, naverReservations, specialDates, user] =
    await Promise.all([
      prisma.reservation.findMany({
        where: {
          date: {
            gte: todayInKorea,
          },
        },
        select: {
          date: true,
          time: true,
          id: true,
          roomType: true,
        },
      }),
      prisma.naverReservation.findMany({
        where: {
          date: {
            gte: todayInKorea,
          },
        },
        select: {
          date: true,
          time: true,
          id: true,
          roomType: true,
        },
      }),
      prisma.specialDate.findMany({
        where: {
          date: {
            gte: todayInKorea.replace(/\//g, "-"),
          },
        },
        select: {
          date: true,
          type: true,
          discount: true,
        },
      }),
      prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          point: true,
        },
      }),
    ]);
  const reservations = [...normalReservations, ...naverReservations];
  return (
    <main className="page-padding ~pb-[4rem]/[6rem]">
      <ReservationClient
        reservations={reservations}
        points={user?.point ?? 0}
        specialDates={specialDates}
      />
    </main>
  );
};

export default ReservationPage;
