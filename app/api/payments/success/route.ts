import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  getPendingReservation,
  deletePendingReservation,
} from "@/lib/payment.server";
import { getRoomDuration } from "@/lib/timeUtils";
import { RoomType } from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentKey = url.searchParams.get("paymentKey");
  const orderId = url.searchParams.get("orderId");
  const amount = url.searchParams.get("amount");

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.redirect(
      `${
        url.origin
      }/account/reservation?error=INVALID_PAYMENT_PARAMS&message=${encodeURIComponent(
        "결제 정보가 올바르지 않습니다."
      )}`
    );
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.redirect(
        `${
          url.origin
        }/account/reservation?error=UNAUTHORIZED&message=${encodeURIComponent(
          "로그인이 필요합니다."
        )}`
      );
    }

    // Get stored reservation details
    const reservationDetails = await getPendingReservation(orderId);
    if (!reservationDetails) {
      return NextResponse.redirect(
        `${
          url.origin
        }/account/reservation?error=RESERVATION_NOT_FOUND&message=${encodeURIComponent(
          "예약 정보를 찾을 수 없습니다."
        )}`
      );
    }

    // Verify payment with TossPayments API
    const secretKey = process.env.TOSS_CLIENT_SECRET;
    if (!secretKey) {
      throw new Error("TOSS_CLIENT_SECRET is not configured");
    }

    const paymentConfirmation = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(secretKey + ":").toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: parseInt(amount),
        }),
      }
    );

    if (!paymentConfirmation.ok) {
      const error = await paymentConfirmation.json();
      console.error("Payment confirmation failed:", error);
      return NextResponse.redirect(
        `${
          url.origin
        }/account/reservation?error=PAYMENT_CONFIRMATION_FAILED&message=${encodeURIComponent(
          "결제 확인에 실패했습니다."
        )}`
      );
    }

    // Verify payment amount matches
    if (reservationDetails.paidPrice !== parseInt(amount)) {
      return NextResponse.redirect(
        `${
          url.origin
        }/account/reservation?error=AMOUNT_MISMATCH&message=${encodeURIComponent(
          "결제 금액이 일치하지 않습니다."
        )}`
      );
    }

    // Execute all reservation logic in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Check for blocked dates
      const formattedDate = reservationDetails.date.replace(/\//g, "-");
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

      // Check if user has enough points
      if (reservationDetails.usedPoint > 0) {
        const user = await tx.user.findUnique({
          where: { id: session.user.id },
          select: { point: true },
        });

        if (!user || user.point < reservationDetails.usedPoint) {
          return {
            success: false,
            message: "포인트가 부족합니다.",
          };
        }
      }

      // Check time availability
      const existingReservations = await tx.reservation.findMany({
        where: { date: reservationDetails.date },
        select: {
          time: true,
          roomType: true,
        },
      });

      if (existingReservations.length > 0) {
        const [requestedHours, requestedMinutes] = reservationDetails.time
          .split(":")
          .map(Number);
        const requestedStartTime = requestedHours * 60 + requestedMinutes;
        const requestedDuration = getRoomDuration(reservationDetails.roomType);
        const requestedEndTime = requestedStartTime + requestedDuration;

        for (const reservation of existingReservations) {
          const [existingHours, existingMinutes] = reservation.time
            .split(":")
            .map(Number);
          const existingStartTime = existingHours * 60 + existingMinutes;
          const existingDuration = getRoomDuration(reservation.roomType);
          const existingEndTime = existingStartTime + existingDuration;

          // Check for time overlap
          if (
            (requestedStartTime >= existingStartTime &&
              requestedStartTime < existingEndTime) ||
            (requestedEndTime > existingStartTime &&
              requestedEndTime <= existingEndTime) ||
            (requestedStartTime <= existingStartTime &&
              requestedEndTime >= existingEndTime)
          ) {
            // If times overlap, apply room type restrictions
            // If there's a family room reservation, no other rooms can be booked
            if (reservation.roomType.includes("FAMILY")) {
              return {
                success: false,
                message: "선택하신 시간에는 예약이 불가능합니다.",
              };
            }

            // If requesting family room and there's any existing reservation
            if (reservationDetails.roomType.includes("FAMILY")) {
              return {
                success: false,
                message: "선택하신 시간에는 예약이 불가능합니다.",
              };
            }

            // If there's a men's room reservation, only women's room can be booked
            if (
              reservation.roomType.includes("MEN") &&
              !reservationDetails.roomType.includes("WOMEN")
            ) {
              return {
                success: false,
                message: "선택하신 시간에는 예약이 불가능합니다.",
              };
            }

            // If there's a women's room reservation, only men's room can be booked
            if (
              reservation.roomType.includes("WOMEN") &&
              !reservationDetails.roomType.includes("MEN")
            ) {
              return {
                success: false,
                message: "선택하신 시간에는 예약이 불가능합니다.",
              };
            }
          }
        }
      }

      // Create the reservation
      const reservation = await tx.reservation.create({
        data: {
          date: reservationDetails.date,
          time: reservationDetails.time,
          roomType: reservationDetails.roomType as RoomType,
          men: reservationDetails.men,
          women: reservationDetails.women,
          children: reservationDetails.children,
          infants: reservationDetails.infants,
          message: reservationDetails.message,
          price: reservationDetails.price,
          paidPrice: reservationDetails.paidPrice,
          usedPoint: reservationDetails.usedPoint,
          orderId,
          paymentKey,
          paymentStatus: "DONE",
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });

      // Deduct points if used
      if (reservationDetails.usedPoint > 0) {
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            point: {
              decrement: reservationDetails.usedPoint,
            },
          },
        });
      }

      return { success: true, data: reservation };
    });

    // Clean up stored reservation
    await deletePendingReservation(orderId);

    if (!result.success) {
      // Payment succeeded but reservation failed - should implement refund here
      console.error(
        "Reservation failed after successful payment:",
        result.message
      );
      return NextResponse.redirect(
        `${
          url.origin
        }/account/reservation?error=RESERVATION_FAILED&message=${encodeURIComponent(
          result.message || "예약 생성에 실패했습니다."
        )}`
      );
    }

    return NextResponse.redirect(
      `${url.origin}/account/history?success=true&message=${encodeURIComponent(
        "결제가 완료되었습니다."
      )}`
    );
  } catch (err) {
    console.error("Payment success handler error:", err);
    return NextResponse.redirect(
      `${
        url.origin
      }/account/reservation?error=PAYMENT_ERROR&message=${encodeURIComponent(
        "결제 처리 중 오류가 발생했습니다."
      )}`
    );
  }
}
