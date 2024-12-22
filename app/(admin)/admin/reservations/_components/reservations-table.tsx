"use client";

import { Reservation, User } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cancelReservation } from "@/actions/reservations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface ReservationsTableProps {
  reservations: (Reservation & {
    user: Pick<User, "name" | "email" | "phone">;
  })[];
}

export function ReservationsTable({ reservations }: ReservationsTableProps) {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const handleCancelReservation = async (id: string) => {
    if (!confirm("예약을 취소하시겠습니까?")) return;

    try {
      const result = await cancelReservation(id);

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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>예약자</TableHead>
            <TableHead>인원</TableHead>
            <TableHead>룸타입</TableHead>
            <TableHead>날짜</TableHead>
            <TableHead>시간</TableHead>
            <TableHead>결제금액</TableHead>
            <TableHead>메시지</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                예약이 없습니다
              </TableCell>
            </TableRow>
          ) : (
            reservations.map((reservation) => (
              <TableRow key={reservation.id} className="whitespace-nowrap">
                <TableCell className="min-w-[6.25rem]">
                  {reservation.user?.name}
                </TableCell>
                <TableCell className="min-w-[7.5rem]">
                  <div className="flex flex-col gap-0.5 text-sm">
                    {[
                      { count: reservation.men, label: "성인 남" },
                      { count: reservation.women, label: "성인 여" },
                      { count: reservation.children, label: "아동" },
                      { count: reservation.infants, label: "유아" },
                    ]
                      .filter((item) => item.count > 0)
                      .map((item, index) => (
                        <span key={index} className="whitespace-nowrap">
                          {item.label} {item.count}명
                        </span>
                      ))}
                    <span className="mt-1 whitespace-nowrap text-xs text-muted-foreground">
                      총{" "}
                      {reservation.men +
                        reservation.women +
                        reservation.children +
                        reservation.infants}
                      명
                    </span>
                  </div>
                </TableCell>
                <TableCell className="min-w-[6.25rem]">
                  {parseRoomInfo(reservation.roomType).name}
                </TableCell>
                <TableCell className="min-w-[6.25rem]">
                  {reservation.date}
                </TableCell>
                <TableCell className="min-w-[6.25rem]">
                  {reservation.time}
                </TableCell>
                <TableCell className="min-w-[6.25rem]">
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
                </TableCell>
                <TableCell className="min-w-[12.5rem]">
                  <div className="max-w-[12.5rem] overflow-hidden">
                    {reservation.message ? (
                      <button
                        onClick={() => setSelectedMessage(reservation.message)}
                        className="w-full truncate text-left hover:underline"
                      >
                        {reservation.message}
                      </button>
                    ) : (
                      "-"
                    )}
                  </div>
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
                          href={`/admin/reservations/${reservation.id}`}
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

      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>메시지</DialogTitle>
            <DialogDescription>{selectedMessage}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
