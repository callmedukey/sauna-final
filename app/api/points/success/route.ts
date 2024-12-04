import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  getPendingReservation,
  deletePendingReservation,
} from "@/lib/payment.server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentKey = url.searchParams.get("paymentKey");
  const orderId = url.searchParams.get("orderId");
  const amount = url.searchParams.get("amount");

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.redirect(
      `${url.origin}/account/points?error=INVALID_PAYMENT_PARAMS&message=${encodeURIComponent("결제 정보가 올바르지 않습니다.")}`
    );
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.redirect(
        `${url.origin}/account/points?error=UNAUTHORIZED&message=${encodeURIComponent("로그인이 필요합니다.")}`
      );
    }

    // Get stored point purchase details
    const paymentDetails = await getPendingReservation(orderId);
    if (!paymentDetails || paymentDetails.type !== "POINT") {
      return NextResponse.redirect(
        `${url.origin}/account/points?error=PAYMENT_NOT_FOUND&message=${encodeURIComponent("결제 정보를 찾을 수 없습니다.")}`
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
        `${url.origin}/account/points?error=PAYMENT_CONFIRMATION_FAILED&message=${encodeURIComponent("결제 확인에 실패했습니다.")}`
      );
    }

    // Verify payment amount matches
    if (paymentDetails.amount !== parseInt(amount)) {
      return NextResponse.redirect(
        `${url.origin}/account/points?error=AMOUNT_MISMATCH&message=${encodeURIComponent("결제 금액이 일치하지 않습니다.")}`
      );
    }

    // Execute all point purchase logic in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create point payment record
      const pointPayment = await tx.pointPayment.create({
        data: {
          amount: paymentDetails.amount,
          points: paymentDetails.points,
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

      // Update user's points
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          point: {
            increment: paymentDetails.points,
          },
        },
      });

      return { success: true, data: pointPayment };
    });

    // Clean up stored point purchase
    await deletePendingReservation(orderId);

    // Revalidate the points page to show updated points
    revalidatePath("/account/points");

    return NextResponse.redirect(
      `${url.origin}/account/points?success=true&message=${encodeURIComponent("포인트 충전이 완료되었습니다.")}`
    );
  } catch (err) {
    console.error("Point payment success handler error:", err);
    return NextResponse.redirect(
      `${url.origin}/account/points?error=PAYMENT_ERROR&message=${encodeURIComponent("결제 처리 중 오류가 발생했습니다.")}`
    );
  }
} 