"use server";

import prisma from "@/lib/prisma";
import { RoomType } from "@prisma/client";

interface ValidateReservationParams {
  date: string;
  basePrice: number;
  finalPrice: number;
}

export async function validateReservation({
  date,
  basePrice,
  finalPrice,
}: ValidateReservationParams) {
  try {
    // Convert date format from yyyy/MM/dd to yyyy-MM-dd
    const formattedDate = date.replace(/\//g, "-");

    // Check if date is blocked
    const specialDate = await prisma.specialDate.findFirst({
      where: {
        date: formattedDate,
      },
    });

    if (specialDate?.type === "BLOCKED") {
      return {
        success: false,
        error: "This date is not available for reservations",
      };
    }

    // Calculate expected price with discount if applicable
    let expectedPrice = basePrice;
    if (specialDate?.type === "DISCOUNT" && specialDate.discount) {
      expectedPrice = Math.floor(basePrice * (1 - specialDate.discount / 100));
    }

    if (finalPrice !== expectedPrice) {
      return {
        success: false,
        error: "Invalid price calculation",
      };
    }

    return {
      success: true,
      discountedPrice: expectedPrice,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to validate reservation",
    };
  }
}

export async function calculateFinalPrice({
  date,
  basePrice,
}: {
  date: string;
  basePrice: number;
}) {
  try {
    const formattedDate = date.replace(/\//g, "-");
    const specialDate = await prisma.specialDate.findFirst({
      where: {
        date: formattedDate,
      },
    });

    if (specialDate?.type === "DISCOUNT" && specialDate.discount) {
      return {
        success: true,
        price: Math.floor(basePrice * (1 - specialDate.discount / 100)),
      };
    }

    return {
      success: true,
      price: basePrice,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to calculate price",
    };
  }
}
