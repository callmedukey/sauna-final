import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, price } = body;

    // Convert date format from yyyy/MM/dd to yyyy-MM-dd
    const formattedDate = date.replace(/\//g, "-");

    // Check if date is blocked
    const specialDate = await prisma.specialDate.findFirst({
      where: {
        date: formattedDate,
      },
    });

    if (specialDate?.type === "BLOCKED") {
      return NextResponse.json(
        { error: "This date is not available for reservations" },
        { status: 400 }
      );
    }

    // Validate price with discount if applicable
    if (specialDate?.type === "DISCOUNT" && specialDate.discount) {
      const expectedPrice = Math.floor(
        price * (1 - specialDate.discount / 100)
      );
      if (body.finalPrice !== expectedPrice) {
        return NextResponse.json(
          { error: "Invalid price calculation" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to validate reservation" },
      { status: 500 }
    );
  }
}
