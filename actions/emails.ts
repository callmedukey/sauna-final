"use server";

import { headers } from "next/headers";
import { SolapiMessageService } from "solapi";

import { RecoverAccountSchema } from "@/definitions/zod";
import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { emailRateLimit, smsRateLimit } from "@/lib/redis.server";

export const sendVerificationSMS = async (phone: string): ActionResponse => {
  const head = await headers();
  const cf = head.get("cf-connecting-ip");
  const ip = cf ?? head.get("x-forwarded-for") ?? "";

  const success = await smsRateLimit(phone, ip);

  if (!success) {
    return { success: false, message: "너무 많은 요청을 보냈습니다." };
  }

  const solapi = new SolapiMessageService(
    process.env.SOLAPI_API_KEY as string,
    process.env.SOLAPI_API_SECRET as string
  );

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const upserted = await prisma.verificationSMS.upsert({
    where: { phone },
    update: { code },
    create: {
      code,
      phone,
    },
  });

  if (!upserted) {
    return { success: false, message: "인증번호 생성 실패" };
  }

  const res = await solapi.sendOne({
    to: phone,
    from: process.env.SOLAPI_SENDER_PHONE_NUMBER as string,
    text: `솔로사우나 인증번호: [ ${code} ]`,
  });

  console.log(res);

  if (res.statusCode === "2000") {
    return {
      success: true,
      message: "인증번호 발송 완료",
    };
  } else {
    return {
      success: false,
      message: "인증번호 발송 오류",
    };
  }
};

export const sendVerificationEmail = async (email: string) => {
  const head = await headers();
  const cf = head.get("cf-connecting-ip");
  const ip = cf ?? head.get("x-forwarded-for") ?? "";

  if (!ip) {
    return { success: false, message: "관리자에게 문의해주세요" };
  }

  const validated = await RecoverAccountSchema.safeParseAsync({ email });

  if (!validated.success) {
    return { success: false, message: "올바른 이메일 형식이 아닙니다." };
  }
  const success = await emailRateLimit(validated.data.email, ip);

  if (!success) {
    return { success: false, message: "너무 많은 요청을 보냈습니다." };
  }

  const user = await prisma.user.findUnique({
    where: { email: validated.data.email },
    select: { id: true },
  });

  if (!user) {
    return { success: false, message: "존재하지 않는 이메일입니다." };
  }

  const code = Math.floor(1000 + Math.random() * 9000).toString();

  const verificationEmail = await prisma.verificationEmail.upsert({
    where: { email: validated.data.email },
    update: { code },
    create: {
      code,
      email: validated.data.email,
      user: { connect: { id: user.id } },
    },
  });

  if (!verificationEmail) {
    return { success: false, message: "이메일 인증 실패" };
  }

  const emailSent = await sendEmail({
    to: validated.data.email,
    subject: "이메일 인증 코드",
    text: `인증 코드: ${code}`,
    html: `<p>인증 코드: ${code}</p>`,
  }).catch((error) => {
    console.error(error);
    return false;
  });

  if (!emailSent) {
    return { success: false, message: "이메일 전송 실패" };
  }

  return { success: true, message: "인증 코드가 전송되었습니다." };
};
