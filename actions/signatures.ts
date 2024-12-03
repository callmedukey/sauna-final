"use server";

import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function saveSignature(
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "권한이 없습니다." };
    }

    const file = formData.get("file") as File;
    const reservationId = formData.get("reservationId") as string;
    const naverReservationId = formData.get("naverReservationId") as string;

    if (!file || !reservationId) {
      return { success: false, message: "필수 정보가 누락되었습니다." };
    }

    // Generate unique filename
    const fileName = `${uuidv4()}.pdf`;
    const filePath = path.join(process.cwd(), "admin/signatures", fileName);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to disk
    await writeFile(filePath, buffer);

    // Save to database with conditional relation
    if (naverReservationId) {
      await prisma.signedAgreement.create({
        data: {
          path: fileName,
          naverReservation: {
            connect: { id: naverReservationId },
          },
        },
      });
    } else {
      await prisma.signedAgreement.create({
        data: {
          path: fileName,
          reservation: {
            connect: { id: reservationId },
          },
        },
      });
    }

    revalidatePath(`/admin/naver/[id]`, "page");
    revalidatePath(`/admin/reservations/[id]`, "page");
    revalidatePath(`/admin/history`, "page");
    return { success: true };
  } catch (error) {
    console.error("Error saving signature:", error);
    return { success: false, message: "서명 저장에 실패했습니다." };
  }
}

export async function cancelSignature(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "권한이 없습니다." };
    }

    await prisma.reservation.delete({
      where: { id },
    });

    revalidatePath("/admin/history");
    revalidatePath(`/admin/reservations/[id]`, "page");
    revalidatePath(`/admin/naver/[id]`, "page");

    return { success: true };
  } catch (error) {
    console.error("Error canceling signature:", error);
    return {
      success: false,
      message: "예약 취소에 실패했습니다.",
    };
  }
}
