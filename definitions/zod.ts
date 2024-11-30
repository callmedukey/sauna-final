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
});

export const LoginSchema = UserSchema.pick({ email: true, password: true });
