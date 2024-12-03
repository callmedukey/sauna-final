import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, date, time, reservationNumber } = body;

    const reservation = await prisma.naverReservation.create({
      data: {
        name,
        date,
        time,
        reservationNumber,
      },
    });

    revalidatePath("/admin/naver");
    return NextResponse.json(reservation);
  } catch (error) {
    console.error("[NAVER_RESERVATIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
