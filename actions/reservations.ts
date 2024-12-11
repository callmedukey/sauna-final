"use server";

import { unlink } from "fs/promises";
import path from "path";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getRoomDuration, checkTimeOverlap } from "@/lib/timeUtils";

export async function cancelReservation(
  id: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();
    if (!session?.user || !session.user.isAdmin) {
      return { success: false, message: "권한이 없습니다." };
    }

    // Get the reservation with its signatures
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        signedAgreement: true,
      },
    });

    if (!reservation) {
      return { success: false, message: "예약을 찾을 수 없습니다." };
    }

    // Delete all signature files and database records
    for (const signature of reservation.signedAgreement) {
      const filePath = path.join(
        process.cwd(),
        "admin/signatures",
        signature.path
      );
      try {
        await unlink(filePath);
      } catch (error) {
        console.error(
          `Error deleting signature file: ${signature.path}`,
          error
        );
      }
    }

    // Update reservation and delete signatures in a transaction
    await prisma.$transaction([
      prisma.signedAgreement.deleteMany({
        where: { reservationId: id },
      }),
      prisma.reservation.update({
        where: { id },
        data: { canceled: true },
      }),
    ]);

    revalidatePath("/admin/reservations");
    return { success: true };
  } catch (error) {
    console.error("Error canceling reservation:", error);
    return { success: false, message: "예약 취소 중 오류가 발생했습니다." };
  }
}

export async function validateReservation(
  date: string,
  time: string,
  roomType: string,
  duration: number
): Promise<{ isValid: boolean; message?: string }> {
  // Get existing reservations for the same date
  const existingReservations = await prisma.reservation.findMany({
    where: {
      date,
      canceled: false,
    },
    select: {
      time: true,
      roomType: true,
    },
  });

  const [hours, minutes] = time.split(":").map(Number);
  const newStartTime = hours * 60 + minutes;

  for (const reservation of existingReservations) {
    const [resHours, resMinutes] = reservation.time.split(":").map(Number);
    const resStartTime = resHours * 60 + resMinutes;
    const resDuration = getRoomDuration(reservation.roomType);

    const hasOverlap = checkTimeOverlap(
      newStartTime,
      duration,
      resStartTime,
      resDuration
    );

    if (hasOverlap) {
      // Rule 2: When 혼성룸 is selected or reserved, no other rooms allowed
      if (reservation.roomType.includes("MIX") || roomType.includes("MIX")) {
        return {
          isValid: false,
          message: "혼성룸 예약 시간과 중복되는 예약은 불가능합니다.",
        };
      }

      // Rule 1: 60/90 minute room restrictions
      if (reservation.roomType.includes("MEN")) {
        // If men's 60 is reserved, block men's 90 and vice versa
        if (reservation.roomType.includes("60") && roomType.includes("MEN")) {
          return {
            isValid: false,
            message: "남성룸 예약 시간과 중복되는 예약은 불가능합니다.",
          };
        }
        // Block women's family and mix rooms when men's room is reserved
        if (roomType.includes("WOMEN_FAMILY") || roomType.includes("MIX")) {
          return {
            isValid: false,
            message: "남성룸 예약 시간과 중복되는 예약은 불가능합니다.",
          };
        }
      }

      if (reservation.roomType.includes("WOMEN")) {
        // If women's 60 is reserved, block women's 90 and vice versa
        if (reservation.roomType.includes("60") && roomType.includes("WOMEN")) {
          return {
            isValid: false,
            message: "여성룸 예약 시간과 중복되는 예약은 불가능합니다.",
          };
        }
        // Block men's family and mix rooms when women's room is reserved
        if (roomType.includes("MEN_FAMILY") || roomType.includes("MIX")) {
          return {
            isValid: false,
            message: "여성룸 예약 시간과 중복되는 예약은 불가능합니다.",
          };
        }
      }

      // Rule 3: Family room exceptions - if validation reaches here, it means
      // the combination is not allowed (since allowed combinations return true earlier)
      if (reservation.roomType.includes("FAMILY")) {
        if (
          !(
            (reservation.roomType.includes("MEN_FAMILY") &&
              (roomType.includes("WOMEN60") || roomType.includes("WOMEN90"))) ||
            (reservation.roomType.includes("WOMEN_FAMILY") &&
              (roomType.includes("MEN60") || roomType.includes("MEN90")))
          )
        ) {
          return {
            isValid: false,
            message: "가족룸 예약 시간과 중복되는 예약은 불가능합니다.",
          };
        }
      }

      // Block same room type
      if (reservation.roomType === roomType) {
        return {
          isValid: false,
          message: "동일한 룸 타입의 예약이 이미 존재합니다.",
        };
      }
    }
  }

  return { isValid: true };
}
