import { RoomType } from "@prisma/client";
import { z } from "zod";

export const NaverReservationSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  date: z
    .string()
    .min(1, "날짜를 입력해주세요")
    .regex(
      /^\d{4}\/\d{2}\/\d{2}$/,
      "날짜 형식이 올바르지 않습니다 (예: 2024/01/24)"
    ),
  time: z.string().min(1, "시간을 입력해주세요"),
  reservationNumber: z.string().min(1, "예약 번호를 입력해주세요"),
  roomType: z.nativeEnum(RoomType),
});
