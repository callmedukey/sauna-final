"use client";

import { NaverReservation, Reservation, User } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { cancelNaverReservation } from "@/actions/naver-reservations";
import { cancelSignature } from "@/actions/signatures";
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
import { parseRoomInfo } from "@/lib/parseRoomName";

type RegularReservation = Reservation & {
  user: Pick<User, "name" | "phone">;
};

interface HistoryTableProps {
  regularReservations: RegularReservation[];
  naverReservations: NaverReservation[];
}

export function HistoryTable({
  regularReservations,
  naverReservations,
}: HistoryTableProps) {
  console.log(regularReservations, naverReservations);
  // Combine and sort reservations
  const allReservations = [
    ...regularReservations.map((r) => ({
      ...r,
      type: "regular" as const,
      displayName: r.user.name,
      displayPhone: r.user.phone,
      roomType: r.roomType,
    })),
    ...naverReservations.map((r) => ({
      ...r,
      type: "naver" as const,
      displayName: r.name,
      displayPhone: "-",
      roomType: r.roomType,
    })),
  ].sort((a, b) => {
    // Sort by date first
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;

    // Then by time
    const timeCompare = a.time.localeCompare(b.time);
    if (timeCompare !== 0) return timeCompare;

    // Then by room type (if both are regular reservations)
    if (
      a.type === "regular" &&
      b.type === "regular" &&
      a.roomType &&
      b.roomType
    ) {
      return a.roomType.localeCompare(b.roomType);
    }

    // Put regular reservations before Naver reservations if date and time are same
    return a.type === "regular" ? -1 : 1;
  });

  const handleCancelReservation = async (
    id: string,
    type: "regular" | "naver"
  ) => {
    if (!confirm("예약을 취소하시겠습니까?")) return;

    try {
      if (type === "regular") {
        const result = await cancelSignature(id);
        if (!result.success) {
          throw new Error(result.message);
        }
      } else {
        const result = await cancelNaverReservation(id);
        if (!result.success) {
          throw new Error(result.message);
        }
      }
    } catch (error) {
      console.error("Error canceling reservation:", error);
      alert(
        error instanceof Error ? error.message : "예약 취소에 실패했습니다."
      );
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">예약자</TableHead>
          <TableHead className="">연락처</TableHead>
          <TableHead className="">날짜</TableHead>
          <TableHead className="">시간</TableHead>
          <TableHead className="">룸타입</TableHead>
          <TableHead className="">결제금액</TableHead>
          <TableHead className="">예약 종류</TableHead>
          <TableHead className="">예약 번호</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allReservations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              예약이 없습니다
            </TableCell>
          </TableRow>
        ) : (
          allReservations.map((reservation) => (
            <TableRow
              key={`${reservation.type}-${reservation.id}`}
              className="whitespace-nowrap"
            >
              <TableCell className="min-w-[6.25rem]">
                {reservation.displayName}
              </TableCell>
              <TableCell className="min-w-[6.25rem]">
                {reservation.displayPhone}
              </TableCell>
              <TableCell className="min-w-[6.25rem]">
                {reservation.date}
              </TableCell>
              <TableCell className="min-w-[6.25rem]">
                {reservation.time}
              </TableCell>
              <TableCell className="min-w-[6.25rem]">
                {reservation.roomType
                  ? parseRoomInfo(reservation.roomType).name
                  : "-"}
              </TableCell>
              <TableCell className="min-w-[6.25rem]">
                {reservation.type === "regular" && (
                  <>
                    {reservation.price !== reservation.paidPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        {reservation.price.toLocaleString()}원
                      </div>
                    )}
                    <div className="font-medium">
                      {reservation.paidPrice.toLocaleString()}원
                    </div>
                    {reservation.usedPoint > 0 && (
                      <div className="text-xs text-muted-foreground">
                        포인트: {reservation.usedPoint.toLocaleString()}P
                      </div>
                    )}
                  </>
                )}
                {reservation.type === "naver" && "-"}
              </TableCell>
              <TableCell className="min-w-[6.25rem]">
                {reservation.type === "regular" ? "일반" : "네이버"}
              </TableCell>
              <TableCell className="min-w-[6.25rem]">
                {reservation.type === "naver"
                  ? reservation.reservationNumber
                  : "-"}
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
                        href={
                          reservation.type === "regular"
                            ? `/admin/reservations/${reservation.id}`
                            : `/admin/naver/${reservation.id}`
                        }
                        className="w-full"
                      >
                        약관
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600"
                      onClick={() =>
                        handleCancelReservation(
                          reservation.id,
                          reservation.type
                        )
                      }
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
