"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function cancelNaverReservation(
  id: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return { success: false, message: "권한이 없습니다." };
    }

    await prisma.naverReservation.delete({
      where: { id },
    });

    revalidatePath("/admin/naver");
    return { success: true };
  } catch (error) {
    console.error("Error canceling naver reservation:", error);
    return { success: false, message: "예약 취소에 실패했습니다." };
  }
} 