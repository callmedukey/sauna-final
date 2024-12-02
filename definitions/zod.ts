import { RoomType } from "@prisma/client";
import { z } from "zod";

export const UserSchema = z.object({
  email: z
    .string({ required_error: "이메일은 필수 입력 항목입니다." })
    .email("올바른 이메일 형식이 아닙니다.")
    .trim(),
  password: z
    .string({ required_error: "비밀번호는 필수 입력 항목입니다." })
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .trim(),
  name: z.string({ required_error: "이름은 필수 입력 항목입니다." }).trim(),
  phone: z
    .string({ required_error: "전화번호는 필수 입력 항목입니다." })
    .trim()
    .refine((value) => /^\d{3}-\d{3,4}-\d{4}$/.test(value), {
      message: "올바른 전화번호 형식이 아닙니다.",
    }),
});

export const ValidateEmailSchema = UserSchema.pick({ email: true });

export const RecoverAccountSchema = UserSchema.pick({ email: true });

export const LoginSchema = UserSchema.pick({ email: true, password: true });

export const RawRegisterSchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  phone: true,
}).extend({
  confirmPassword: z
    .string({
      required_error: "비밀번호 확인은 필수 입력 항목입니다.",
    })
    .trim(),
  verificationCode: z
    .string({
      required_error: "인증번호 확인은 필수 입력 항목입니다.",
    })
    .length(4, "인증번호는 4자이어야 합니다.")
    .refine((value) => parseInt(value) > 0, {
      message: "올바른 인증번호가 아닙니다.",
    }),
});

export const RegisterSchema = RawRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "비밀번호가 일치하지 않습니다.",
  }
);

export const RegisterPartOneSchema = RawRegisterSchema.pick({
  email: true,
  password: true,
  confirmPassword: true,
});

export const UpdateProfileSchema = RegisterSchema;

export const ReservationSchema = z.object({
  men: z.number().min(0),
  women: z.number().min(0),
  children: z.number().min(0),
  infants: z.number().min(0),
  message: z.string().optional(),
  usedPoint: z.number().optional(),
  roomType: z.nativeEnum(RoomType),
  date: z.string(),
  time: z.string(),
  isWeekend: z.boolean(),
  price: z.number(),
  paidPrice: z.number(),
});
