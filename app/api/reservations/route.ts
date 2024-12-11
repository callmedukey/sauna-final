import { format, isBefore } from "date-fns";
import { NextResponse } from "next/server";
import { SolapiMessageService } from "solapi";

import { parseRoomInfo } from "@/lib/parseRoomName";
import prisma from "@/lib/prisma";
import { getRoomDuration } from "@/lib/timeUtils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, time, roomType } = body;

    // Convert to Korean timezone for comparison
    const now = new Date();
    const koreaTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );
    const koreaToday = format(koreaTime, "yyyy/MM/dd");

    // Check if the date is in the past
    if (isBefore(new Date(date), new Date(koreaToday))) {
      return NextResponse.json(
        { error: "지난 날짜는 예약할 수 없습니다." },
        { status: 400 }
      );
    }

    // If it's today, check if the time is in the past
    if (date === koreaToday) {
      const [hours, minutes] = time.split(":").map(Number);
      const reservationTime = new Date(koreaTime);
      reservationTime.setHours(hours, minutes, 0, 0);

      if (isBefore(reservationTime, koreaTime)) {
        return NextResponse.json(
          { error: "지난 시간은 예약할 수 없습니다." },
          { status: 400 }
        );
      }
    }

    // Check for existing reservations at the same time
    const existingReservations = await prisma.reservation.findMany({
      where: {
        date,
        time,
        canceled: false,
      },
    });

    if (existingReservations.length > 0) {
      // Check room type conflicts
      const hasConflict = existingReservations.some((reservation) => {
        // If there's a family room reservation, no other rooms can be booked
        if (reservation.roomType.includes("FAMILY")) return true;

        // If requesting family room and there's any existing reservation
        if (roomType.includes("FAMILY")) return true;

        // If there's a men's room reservation, only women's room can be booked
        if (
          reservation.roomType.includes("MEN") &&
          !roomType.includes("WOMEN")
        ) {
          return true;
        }

        // If there's a women's room reservation, only men's room can be booked
        if (
          reservation.roomType.includes("WOMEN") &&
          !roomType.includes("MEN")
        ) {
          return true;
        }

        // Direct time slot conflict for same room type
        return reservation.roomType === roomType;
      });

      if (hasConflict) {
        return NextResponse.json(
          { error: "해당 시간에는 이미 예약이 있습니다." },
          { status: 400 }
        );
      }
    }

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: body,
      include: {
        user: true,
      },
    });

    const solapi = new SolapiMessageService(
      process.env.SOLAPI_API_KEY!,
      process.env.SOLAPI_API_SECRET!
    );
    await solapi.sendOne({
      to: reservation.user.phone,
      from: process.env.SOLAPI_SENDER_PHONE_NUMBER!,
      text: `안녕하세요. ${reservation.user.name} 고객님
      솔로사우나_레포(노량진점) 예약이 확정되었습니다. 
      
      예약자명: ${reservation.user.name} 
      예약인원 : ${
        reservation.men +
        reservation.women +
        reservation.children +
        reservation.infants
      }명
      예약일시 : ${date} ${time}
      룸 : ${roomType}
      이용시간 : ${getRoomDuration(roomType)}분
      요청사항 : ${reservation?.message || "없음"} 
      
      예약 문의 : 0507-1370-8553
      주소 : 서울 동작구 노들로2길 7 노량진드림스퀘어 A동 206호
      네이버지도 : https://naver.me/F42xZkUK
      예약 변경,취소가 필요하시면 전화 부탁드립니다.
      사우나 이용 법 및 안전 확인 동의 설명을 위하여 5분 일찍 도착해 주시기 바랍니다.
      10분 이상 늦으실 경우 자동으로 예약이 취소되니 이 점 유의해 주세요.
      노쇼(No-show) 시 환불이 불가능하니 양해 부탁드립니다.
      편안한 시간 되시길 바랍니다.
      감사합니다!
`,
    });
    await solapi.sendOne({
      to: process.env.SOLAPI_SENDER_PHONE_NUMBER!,
      from: process.env.SOLAPI_SENDER_PHONE_NUMBER!,
      text: `1. ${reservation.user.name}
      2. ${parseRoomInfo(roomType).name}  
      3. 남성 ${reservation.men}명/ 여성 ${reservation.women}명/ 어린이 ${
        reservation.children
      }명/ 유아 ${reservation.infants}명
      4. ${date}, ${time} 
      5. ${reservation.user.phone}
      6. ${reservation.message || "없음"} 
      7. ${reservation.paidPrice}원

`,
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json(
      { error: "예약 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
