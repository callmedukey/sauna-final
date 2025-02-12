"use client";

import { NaverReservation } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { cancelNaverReservation } from "@/actions/naver-reservations";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoomInfo } from "@/definitions/constants";

interface NaverReservationsTableProps {
  reservations: NaverReservation[];
}

export function NaverReservationsTable({
  reservations,
}: NaverReservationsTableProps) {
  const handleCancelReservation = async (id: string) => {
    if (!confirm("예약을 취소하시겠습니까?")) return;

    try {
      const result = await cancelNaverReservation(id);

      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error canceling reservation:", error);
      alert(
        error instanceof Error ? error.message : "예약 취소에 실패했습니다."
      );
    }
  };

  const getRoomTypeName = (roomType: string) => {
    const baseType = roomType.replace("WEEKEND", "");
    const isWeekend = roomType.includes("WEEKEND");
    const roomInfo = RoomInfo[baseType as keyof typeof RoomInfo];

    return roomInfo
      ? `${roomInfo.name}${isWeekend ? " (주말)" : ""}`
      : roomType;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>날짜</TableHead>
          <TableHead>시간</TableHead>
          <TableHead>객실 타입</TableHead>
          <TableHead>예약 번호</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              예약이 없습니다
            </TableCell>
          </TableRow>
        ) : (
          reservations.map((reservation) => (
            <TableRow key={reservation.id} className="whitespace-nowrap">
              <TableCell className="min-w-[6.25rem]">
                {reservation.name}
              </TableCell>
              <TableCell className="min-w-[6.25rem]">
                {reservation.date}
              </TableCell>
              <TableCell className="min-w-[6.25rem]">
                {reservation.time}
              </TableCell>
              <TableCell className="min-w-48">
                {getRoomTypeName(reservation.roomType)}
              </TableCell>
              <TableCell className="min-w-[6.25rem]">
                {reservation.reservationNumber}
              </TableCell>
              <TableCell className="w-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                      <span className="sr-only">메뉴 열기</span>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/admin/naver/${reservation.id}`}
                        className="w-full"
                      >
                        약관
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      예약 취소
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
