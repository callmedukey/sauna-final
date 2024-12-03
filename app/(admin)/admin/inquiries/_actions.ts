"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const answerSchema = z.string()
  .min(1, "답변을 입력해주세요")
  .max(1000, "답변은 1000자를 초과할 수 없습니다");

export async function answerInquiry(id: string, answer: string) {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    return { success: false, error: "관리자만 답변할 수 있습니다" };
  }

  try {
    // Validate the answer
    const validatedAnswer = answerSchema.parse(answer);

    await prisma.inquiry.update({
      where: { id },
      data: {
        answer: validatedAnswer,
        answeredAt: new Date(),
        answeredBy: session.user.id,
      },
    });

    revalidatePath("/admin/inquiries");
    revalidatePath("/community/inquiry");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { success: false, error: firstError.message };
    }
    return { success: false, error: "답변 등록에 실패했습니다" };
  }
}

export async function deleteInquiry(id: string) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "로그인이 필요합니다" };
  }

  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!inquiry) {
      return { success: false, error: "문의를 찾을 수 없습니다" };
    }

    // Only allow admin or the inquiry creator to delete
    if (!session.user.isAdmin && inquiry.userId !== session.user.id) {
      return { success: false, error: "삭제 권한이 없습니다" };
    }

    await prisma.inquiry.delete({
      where: { id },
    });

    revalidatePath("/admin/inquiries");
    revalidatePath("/community/inquiry");
    return { success: true };
  } catch (error) {
    return { success: false, error: "삭제에 실패했습니다" };
  }
} 