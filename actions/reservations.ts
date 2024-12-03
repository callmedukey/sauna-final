"use server";

import { unlink } from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function cancelReservation(id: string): Promise<{ success: boolean; message?: string }> {
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
      const filePath = path.join(process.cwd(), "admin/signatures", signature.path);
      try {
        await unlink(filePath);
      } catch (error) {
        console.error(`Error deleting signature file: ${signature.path}`, error);
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