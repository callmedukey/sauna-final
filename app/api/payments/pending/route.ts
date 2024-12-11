import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { storePendingReservation as _storePendingReservation } from "@/lib/redis.server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { orderId, details } = await request.json();
    if (!orderId || !details) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await _storePendingReservation(orderId, details);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to store pending reservation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
