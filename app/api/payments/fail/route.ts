import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const message = url.searchParams.get("message");
  const orderId = url.searchParams.get("orderId");

  console.error("Payment failed:", { code, message, orderId });

  // Redirect back to reservation page with error
  return NextResponse.redirect(
    `${url.origin}/account/reservation?error=PAYMENT_FAILED&message=${encodeURIComponent(
      message || "결제에 실패했습니다."
    )}`
  );
} 