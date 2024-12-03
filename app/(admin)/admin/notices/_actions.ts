"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateNoticeData {
  title: string;
  content: string;
}

export async function createNotice(data: CreateNoticeData) {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    throw new Error("Unauthorized");
  }

  await prisma.notice.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  revalidatePath("/admin/notices");
}

export async function deleteNotice(id: string) {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    throw new Error("Unauthorized");
  }

  await prisma.notice.delete({
    where: { id },
  });

  revalidatePath("/admin/notices");
} 