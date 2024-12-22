import { RoomType } from "@prisma/client";
import { NextResponse } from "next/server";
import { SolapiMessageService } from "solapi";

import { auth } from "@/auth";
import { parseRoomInfo } from "@/lib/parseRoomName";
import {
  getPendingReservation,
  deletePendingReservation,
} from "@/lib/payment.server";
import prisma from "@/lib/prisma";
import { getRoomDuration } from "@/lib/timeUtils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentKey = url.searchParams.get("paymentKey");
  const orderId = url.searchParams.get("orderId");
  const amount = url.searchParams.get("amount");

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
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
          process.env.NEXT_PUBLIC_BASE_URL
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
          process.env.NEXT_PUBLIC_BASE_URL
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
          process.env.NEXT_PUBLIC_BASE_URL
        }/account/reservation?error=PAYMENT_CONFIRMATION_FAILED&message=${encodeURIComponent(
          "결제 확인에 실패했습니다."
        )}`
      );
    }

    // Verify payment amount matches
    if (reservationDetails.paidPrice !== parseInt(amount)) {
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
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

      // Validate weekend room type
      const reservationDate = new Date(formattedDate);
      const isWeekend =
        reservationDate.getDay() === 0 || reservationDate.getDay() === 6;
      const isWeekendRoom = reservationDetails.roomType.includes("WEEKEND");

      if (isWeekend && !isWeekendRoom) {
        return {
          success: false,
          message: "주말에는 주말 전용 룸만 예약이 가능합니다.",
        };
      }

      if (!isWeekend && isWeekendRoom) {
        return {
          success: false,
          message: "평일에는 평일 전용 룸만 예약이 가능합니다.",
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
        include: {
          user: {
            omit: {
              password: true,
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
            pointHistory: {
              create: {
                point: reservationDetails.usedPoint,
                type: "USED",
              },
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
          process.env.NEXT_PUBLIC_BASE_URL
        }/account/reservation?error=RESERVATION_FAILED&message=${encodeURIComponent(
          result.message || "예약 생성에 실패했습니다."
        )}`
      );
    }

    if (!result.data) {
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/account/reservation?error=RESERVATION_NOT_FOUND&message=${encodeURIComponent(
          "예약 정보를 찾을 수 없습니다."
        )}`
      );
    }

    const solapi = new SolapiMessageService(
      process.env.SOLAPI_API_KEY!,
      process.env.SOLAPI_API_SECRET!
    );
    await solapi.sendOne({
      to: result?.data.user.phone,
      from: process.env.SOLAPI_SENDER_PHONE_NUMBER!,
      text: `안녕하세요. ${result.data.user.name} 고객님
      솔로사우나_레포(노량진점) 예약이 확정되었습니다. 
      
      예약자명: ${result.data.user.name} 
      예약인원 : ${
        result.data.men +
        result.data.women +
        result.data.children +
        result.data.infants
      }명
      예약일시 : ${result.data.date} ${result.data.time}
      룸 : ${parseRoomInfo(result.data.roomType).name}
      이용시간 : ${getRoomDuration(result.data.roomType)}분
      요청사항 : ${result.data.message || "없음"} 
      
      예약 문의 : 0507-1370-8553
      주소 : 서울 동작구 노들로2길 7 노량진드림스퀘어 A동 206호
      네이버지도 : https://naver.me/F42xZkUK
      예약 변경,취소가 필요하시면 전화 부탁드립니다.
      사우나 이용 법 및 안전 확인 동의 설명을 위하여 5분 일찍 도착해 주시기 바랍니다.
      10분 이상 늦으실 경우 자동으로 예약이 취소되니 이 점 유의해 주세요.
      노쇼(No-show) 시 환불이 불가능하니 양해 부탁드립니다.
      편안한 시간 되시길 바랍니다.
      감사합니다!
`,
    });
    await solapi.sendOne({
      to: process.env.SOLAPI_SENDER_PHONE_NUMBER!,
      from: process.env.SOLAPI_SENDER_PHONE_NUMBER!,
      text: `
      1. ${result.data.user.name}
      2. ${parseRoomInfo(result.data.roomType).name}  
      3. 남성 ${result.data.men}명/ 여성 ${result.data.women}명/ 어린이 ${
        result.data.children
      }명/ 유아 ${result.data.infants}명
      4. ${result.data.date}, ${result.data.time} 
      5. ${result.data.user.phone}
      6. ${result.data.message || "없음"} 
      7. ${result.data.paidPrice}원
`,
    });

    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/account/history?success=true&message=${encodeURIComponent(
        "결제가 완료되었습니다."
      )}`
    );
  } catch (err) {
    console.error("Payment success handler error:", err);
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/account/reservation?error=PAYMENT_ERROR&message=${encodeURIComponent(
        "결제 처리 중 오류가 발생했습니다."
      )}`
    );
  }
}
