import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

import ReservationControl from "./_components/ReservationControl";
import MessageHandler from "../history/_components/MessageHandler";

const KOREAN_TIMEZONE = "Asia/Seoul";

const page = async () => {
  const session = await auth();

  if (!session || !session?.user) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
    select: {
      point: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  // Get current date in Korean timezone
  const now = new Date();
  const koreaDate = toZonedTime(now, KOREAN_TIMEZONE);
  const todayInKorea = format(koreaDate, "yyyy/MM/dd");

  const [reservations, specialDates] = await Promise.all([
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
  ]);

  return (
    <main className="px-4 ~pt-[3.75rem]/[12rem] ~pb-[4rem]/[6rem]">
      <MessageHandler />
      <ReservationControl
        reservations={reservations}
        points={user.point}
        specialDates={specialDates}
      />
    </main>
  );
};

export default page;
