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

    await prisma.user.update({
      where: { id: userId },
      data: { point: points },
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