"use server";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { RegisterSchema, UpdateProfileSchema } from "@/definitions/zod";
import prisma from "@/lib/prisma";

export const signUpUser = async (
  data: z.infer<typeof RegisterSchema>
): ActionResponse => {
  try {
    const validated = await RegisterSchema.safeParseAsync(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid data",
      };
    }
    const foundCode = await prisma.verificationSMS.findUnique({
      where: {
        phone: validated.data.phone,
      },
    });

    if (!foundCode) {
      return {
        success: false,
        message: "인증 코드가 없습니다",
      };
    }
    if (foundCode.code !== validated.data.verificationCode) {
      return {
        success: false,
        message: "인증 코드가 일치하지 않습니다",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        phone: validated.data.phone,
      },
    });

    if (user) {
      return {
        success: false,
        message: "이미 가입된 회원입니다",
      };
    }

    const newUser = await prisma.user.create({
      data: {
        phone: validated.data.phone,
        name: validated.data.name,
        email: validated.data.email,
        password: await bcrypt.hash(validated.data.password, 10),
      },
    });

    await prisma.verificationSMS.delete({
      where: {
        phone: validated.data.phone,
      },
    });

    if (!newUser) {
      return {
        success: false,
        message: "회원가입에 실패하였습니다",
      };
    }

    return {
      success: true,
      message: "회원가입이 완료되었습니다",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "서버 오류입니다",
    };
  }
};

export const updateProfile = async (
  data: z.infer<typeof UpdateProfileSchema>
): ActionResponse => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return {
        success: false,
        message: "로그인이 필요합니다",
      };
    }
    const validated = await UpdateProfileSchema.safeParseAsync(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid data",
      };
    }
    const code = await prisma.verificationSMS.findUnique({
      where: {
        phone: validated.data.phone,
      },
      select: {
        code: true,
      },
    });

    if (!code) {
      return {
        success: false,
        message: "인증 코드가 없습니다",
      };
    }

    if (code.code !== validated.data.verificationCode) {
      return {
        success: false,
        message: "인증 코드가 일치하지 않습니다",
      };
    } else {
      await prisma.verificationSMS.delete({
        where: {
          phone: validated.data.phone,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(validated.data.password, 10);

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone,
        password: hashedPassword,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "회원정보 수정에 실패하였습니다",
      };
    }

    revalidatePath("/account/*");

    return {
      success: true,
      message: "회원정보가 수정되었습니다",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "서버 오류입니다",
    };
  }
};
