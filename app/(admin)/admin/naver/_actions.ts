"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import prisma from "@/lib/prisma";

import { NaverReservationSchema } from "./_constants";

export async function createNaverReservation(
  reservation: z.infer<typeof NaverReservationSchema>
) {
  const { name, date, time, reservationNumber, roomType } =
    NaverReservationSchema.parse(reservation);

  await prisma.naverReservation.create({
    data: {
      name,
      date,
      time,
      reservationNumber,
      roomType,
    },
  });

  revalidatePath("/admin/naver");
}
