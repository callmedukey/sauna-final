"use server";

import { Prisma, RoomType } from "@prisma/client";
import { isAfter } from "date-fns";
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
  roomType: RoomType
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

      // Rule 4: When MIX room is active, no other rooms can be active
      if (reservation.roomType.includes("MIX") || roomType.includes("MIX")) {
        return false;
      }

      // Rule 1: Women's room restrictions
      if (roomType.includes("WOMEN") && !roomType.includes("FAMILY")) {
        if (
          reservation.roomType.includes("MIX") ||
          reservation.roomType.includes("WOMEN_FAMILY")
        ) {
          return false;
        }
      }

      // Rule 2: Men's room restrictions
      if (roomType.includes("MEN") && !roomType.includes("FAMILY")) {
        if (
          reservation.roomType.includes("MIX") ||
          reservation.roomType.includes("MEN_FAMILY")
        ) {
          return false;
        }
      }

      // Rule 3: Women's and Men's 60/90 rooms can overlap
      if (
        (roomType.includes("WOMEN") && reservation.roomType.includes("MEN")) ||
        (roomType.includes("MEN") && reservation.roomType.includes("WOMEN"))
      ) {
        if (
          !roomType.includes("FAMILY") &&
          !reservation.roomType.includes("FAMILY")
        ) {
          return true;
        }
      }

      // Block same room type
      if (reservation.roomType === roomType) {
        return false;
      }
    }
  }

  return true;
};

export const submitReservation = async (
  reservation: z.infer<typeof ReservationSchema>
): Promise<{ success: boolean; message?: string; data?: any }> => {
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
      // Check if the selected date is within 6 months
      const selectedDate = new Date(validated.data.date.replace(/\//g, "-"));
      const koreaToday = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
      );
      const sixMonthsFromNow = new Date(koreaToday);
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

      if (isAfter(selectedDate, sixMonthsFromNow)) {
        return {
          success: false,
          message: "예약 가능한 날짜는 6개월 이내입니다.",
        };
      }

      // Check for blocked dates first
      const formattedDate = validated.data.date.replace(/\//g, "-");
      const specialDate = await tx.specialDate.findFirst({
        where: {
          date: formattedDate,
          type: "BLOCKED",
        },
      });

      if (specialDate) {
        return {
          success: false,
          message: "선택하신 날짜는 예약이 불가능합니다.",
        };
      }

      // Get discount information if available
      const discountDate = await tx.specialDate.findFirst({
        where: {
          date: formattedDate,
          type: "DISCOUNT",
        },
      });

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

      // Determine the final room type based on weekend status
      const finalRoomType = validated.data.isWeekend
        ? (`${validated.data.roomType}WEEKEND` as RoomType)
        : validated.data.roomType;

      // Check time availability
      const isAvailable = await checkTimeAvailability(
        tx,
        validated.data.date,
        validated.data.time,
        finalRoomType
      );

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

      // The subtotal is already provided from the client and includes additional fee
      const subtotal = validated.data.price;

      // Apply discount if available
      let finalPrice = subtotal;
      if (discountDate?.discount) {
        finalPrice = Math.floor(subtotal * (1 - discountDate.discount / 100));
      }

      // Verify the paid amount matches the calculated total
      const expectedPaidAmount = finalPrice - (validated.data?.usedPoint ?? 0);
      if (validated.data.paidPrice !== expectedPaidAmount) {
        console.error("Price mismatch:", {
          calculated: expectedPaidAmount,
          submitted: validated.data.paidPrice,
          subtotal,
          finalPrice,
          discount: discountDate?.discount,
          usedPoints: validated.data?.usedPoint,
        });
        return {
          success: false,
          message: "결제 금액이 일치하지 않습니다.",
        };
      }

      // Create the reservation
      const newReservation = await tx.reservation.create({
        data: {
          date: validated.data.date,
          time: validated.data.time,
          roomType: finalRoomType,
          price: subtotal,
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
      }

      return {
        success: true,
        data: newReservation,
      };
    });

    if (!result.success) {
      return {
        success: false,
        message:
          result.message || "예약 제출에 실패하였습니다. 다시 시도해주세요.",
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
