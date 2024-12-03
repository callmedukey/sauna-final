import { format, isBefore } from "date-fns";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, time, roomType } = body;

    // Convert to Korean timezone for comparison
    const now = new Date();
    const koreaTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );
    const koreaToday = format(koreaTime, "yyyy/MM/dd");

    // Check if the date is in the past
    if (isBefore(new Date(date), new Date(koreaToday))) {
      return NextResponse.json(
        { error: "지난 날짜는 예약할 수 없습니다." },
        { status: 400 }
      );
    }

    // If it's today, check if the time is in the past
    if (date === koreaToday) {
      const [hours, minutes] = time.split(":").map(Number);
      const reservationTime = new Date(koreaTime);
      reservationTime.setHours(hours, minutes, 0, 0);

      if (isBefore(reservationTime, koreaTime)) {
        return NextResponse.json(
          { error: "지난 시간은 예약할 수 없습니다." },
          { status: 400 }
        );
      }
    }

    // Check for existing reservations at the same time
    const existingReservations = await prisma.reservation.findMany({
      where: {
        date: date,
        time: time,
        canceled: false,
      },
    });

    if (existingReservations.length > 0) {
      // Check room type conflicts
      const hasConflict = existingReservations.some((reservation) => {
        // If there's a family room reservation, no other rooms can be booked
        if (reservation.roomType.includes("FAMILY")) return true;

        // If requesting family room and there's any existing reservation
        if (roomType.includes("FAMILY")) return true;

        // If there's a men's room reservation, only women's room can be booked
        if (
          reservation.roomType.includes("MEN") &&
          !roomType.includes("WOMEN")
        ) {
          return true;
        }

        // If there's a women's room reservation, only men's room can be booked
        if (
          reservation.roomType.includes("WOMEN") &&
          !roomType.includes("MEN")
        ) {
          return true;
        }

        // Direct time slot conflict for same room type
        return reservation.roomType === roomType;
      });

      if (hasConflict) {
        return NextResponse.json(
          { error: "해당 시간에는 이미 예약이 있습니다." },
          { status: 400 }
        );
      }
    }

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: body,
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json(
      { error: "예약 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
