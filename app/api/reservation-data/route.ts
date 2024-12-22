import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const KOREAN_TIMEZONE = "Asia/Seoul";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      point: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
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

  return NextResponse.json({
    reservations,
    points: user.point,
    specialDates,
  });
} 