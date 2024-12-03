"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createInquirySchema = z.object({
  title: z.string()
    .min(1, "제목을 입력해주세요")
    .max(100, "제목은 100자를 초과할 수 없습니다"),
  content: z.string()
    .min(1, "내용을 입력해주세요")
    .max(1000, "내용은 1000자를 초과할 수 없습니다"),
});

interface CreateInquiryData {
  title: string;
  content: string;
}

export async function createInquiry(data: CreateInquiryData) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "로그인이 필요합니다" };
  }

  try {
    // Validate the input data
    const validatedData = createInquirySchema.parse(data);

    await prisma.inquiry.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        isPrivate: false,
      },
    });

    revalidatePath("/community/inquiry");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { success: false, error: firstError.message };
    }
    return { success: false, error: "문의 등록에 실패했습니다" };
  }
} 