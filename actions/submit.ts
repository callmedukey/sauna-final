"use server";

import { Prisma, RoomType } from "@prisma/client";
import { z } from "zod";

import { auth } from "@/auth";
import { ReservationSchema } from "@/definitions/zod";
import prisma from "@/lib/prisma";
import {
  calculateAdditionalFee,
  checkTimeOverlap,
  getRoomDuration,
} from "@/lib/timeUtils";

const checkTimeAvailability = async (
  tx: Prisma.TransactionClient,
  date: string,
  time: string,
  roomType: string
) => {
  const existingReservations = await tx.reservation.findMany({
    where: { date },
    select: {
      time: true,
      roomType: true,
    },
  });

  if (existingReservations.length === 0) return true;

  const [requestedHours, requestedMinutes] = time.split(":").map(Number);
  const requestedStartTime = requestedHours * 60 + requestedMinutes;
  const requestedDuration = getRoomDuration(roomType);
  const requestedEndTime = requestedStartTime + requestedDuration;

  for (const reservation of existingReservations) {
    const [existingHours, existingMinutes] = reservation.time
      .split(":")
      .map(Number);
    const existingStartTime = existingHours * 60 + existingMinutes;
    const existingDuration = getRoomDuration(reservation.roomType);
    const existingEndTime = existingStartTime + existingDuration;

    const hasOverlap = checkTimeOverlap(
      requestedStartTime,
      requestedDuration,
      existingStartTime,
      existingDuration
    );

    if (hasOverlap) {
      console.log("Time overlap detected:", {
        requested: {
          start: time,
          end: `${Math.floor(requestedEndTime / 60)}:${requestedEndTime % 60}`,
          duration: requestedDuration,
          type: roomType,
        },
        existing: {
          start: reservation.time,
          end: `${Math.floor(existingEndTime / 60)}:${existingEndTime % 60}`,
          duration: existingDuration,
          type: reservation.roomType,
        },
      });

      // If there's a family room reservation, no other rooms can be booked
      if (reservation.roomType.includes("FAMILY")) {
        return false;
      }

      // If requesting family room and there's any existing reservation
      if (roomType.includes("FAMILY")) {
        return false;
      }

      // If there's a men's room reservation, only women's room can be booked
      if (reservation.roomType.includes("MEN") && !roomType.includes("WOMEN")) {
        return false;
      }

      // If there's a women's room reservation, only men's room can be booked
      if (reservation.roomType.includes("WOMEN") && !roomType.includes("MEN")) {
        return false;
      }

      // Direct time slot conflict for same room type
      if (reservation.roomType === roomType) {
        return false;
      }
    }
  }

  return true;
};

export const submitReservation = async (
  reservation: z.infer<typeof ReservationSchema>
): ActionResponse => {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }

    const validated = await ReservationSchema.safeParseAsync(reservation);
    if (!validated.success) {
      return {
        success: false,
        message: "예약 제출에 실패하였습니다.",
      };
    }

    // Execute as transaction
    const result = await prisma.$transaction(async (tx) => {
      console.log("Starting transaction with data:", validated.data);

      // Check if user has enough points
      if (validated.data?.usedPoint && validated.data.usedPoint > 0) {
        const user = await tx.user.findUnique({
          where: { id: session.user.id },
          select: { point: true },
        });

        if (!user || user.point < validated.data.usedPoint) {
          return {
            success: false,
            message: "포인트가 부족합니다.",
          };
        }
      }

      const finalRoomType = validated.data.isWeekend
        ? ((validated.data.roomType + "WEEKEND") as RoomType)
        : (validated.data.roomType as RoomType);

      console.log("Final room type:", finalRoomType);

      // Check time availability
      const isAvailable = await checkTimeAvailability(
        tx,
        validated.data.date,
        validated.data.time,
        finalRoomType
      );

      console.log("Time availability check result:", isAvailable);

      if (!isAvailable) {
        return {
          success: false,
          message: "선택하신 시간에는 예약이 불가능합니다.",
        };
      }

      // Calculate total price including additional fees
      const isFamily = validated.data.roomType.includes("FAMILY");
      const additionalFee = calculateAdditionalFee(
        {
          men: validated.data.men,
          women: validated.data.women,
          children: validated.data.children,
          infants: validated.data.infants,
        },
        isFamily
      );

      console.log("Additional fee calculation:", {
        isFamily,
        additionalFee,
        persons: {
          men: validated.data.men,
          women: validated.data.women,
          children: validated.data.children,
          infants: validated.data.infants,
        },
      });

      const totalPrice = validated.data.price + additionalFee;

      console.log("Price verification:", {
        basePrice: validated.data.price,
        additionalFee,
        totalPrice,
        paidPrice: validated.data.paidPrice,
        usedPoints: validated.data?.usedPoint,
      });

      // Verify the paid amount matches the calculated total
      if (
        totalPrice !==
        validated.data.paidPrice + (validated.data?.usedPoint ?? 0)
      ) {
        console.log("Price mismatch detected");
        return {
          success: false,
          message: "결제 금액이 일치하지 않습니다.",
        };
      }

      // Create the reservation
      console.log("Creating reservation with data:", {
        date: validated.data.date,
        time: validated.data.time,
        roomType: finalRoomType,
        price: totalPrice,
        userId: session.user.id,
      });

      const newReservation = await tx.reservation.create({
        data: {
          date: validated.data.date,
          time: validated.data.time,
          roomType: finalRoomType,
          price: totalPrice,
          paidPrice: validated.data.paidPrice,
          usedPoint: validated.data.usedPoint,
          men: validated.data.men,
          women: validated.data.women,
          children: validated.data.children,
          infants: validated.data.infants,
          message: validated.data.message,
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });

      console.log("Successfully created reservation:", newReservation);

      // Update user points if points were used
      if (validated.data?.usedPoint && validated.data.usedPoint > 0) {
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            point: {
              decrement: validated.data.usedPoint,
            },
          },
        });

        console.log("Updated user points:", {
          userId: session.user.id,
          pointsUsed: validated.data.usedPoint,
        });
      }

      return {
        success: true,
        data: newReservation,
      };
    });

    if (!result.success) {
      return {
        success: false,
        message: "예약 제출에 실패하였습니다. 다시 시도해주세요.",
      };
    }

    return {
      success: true,
      message: "예약이 제출되었습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "예약 제출에 실패하였습니다.",
    };
  }
};
