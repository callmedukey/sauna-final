"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function updateUserPoints(
  userId: string,
  points: number
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return { success: false, message: "권한이 없습니다." };
    }

    // Create unique orderId for the point adjustment
    const orderId = `point_adjust_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    await prisma.$transaction(async (tx) => {
      // Update user points by incrementing
      await tx.user.update({
        where: { id: userId },
        data: {
          point: {
            increment: points,
          },
        },
      });

      // Create point payment record
      await tx.pointPayment.create({
        data: {
          amount: Math.abs(points), // Store absolute value of points
          points: points,
          orderId,
          pointType: points < 0 ? "USED" : "PAYMENT",
          userId,
          paymentStatus: "DONE",
        },
      });
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user points:", error);
    return { success: false, message: "포인트 수정에 실패했습니다." };
  }
}

export async function deleteUser(
  userId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return { success: false, message: "권한이 없습니다." };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "사용자 삭제에 실패했습니다." };
  }
}

export async function searchUsers(name: string) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return { success: false, message: "권한이 없습니다." };
    }

    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        point: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: users };
  } catch (error) {
    console.error("Error searching users:", error);
    return { success: false, message: "사용자 검색에 실패했습니다." };
  }
}
