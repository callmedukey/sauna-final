import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseRoomInfo } from "@/lib/parseRoomName";
import prisma from "@/lib/prisma";

import AccountMenuAside from "../_components/AccountMenuAside";

const page = async () => {
  const session = await auth();
  if (!session || !session.user) return redirect("/");
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    omit: {
      password: true,
    },
  });

  if (!user) return redirect("/");

  const reservations = await prisma.reservation.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <main className="px-4 ~pt-[3.75rem]/[12rem] ~pb-[4rem]/[6rem]">
      <AccountMenuAside />
      <article className="mx-auto min-h-[min(60vh,40rem)] max-w-screen-md px-4">
        <Table>
          <TableHeader className="border-y border-black bg-white ">
            <TableRow className="border-black ~text-xs/base">
              <TableHead className="w-40 text-center text-siteBlack translate-y-1">
                날짜
              </TableHead>
              <TableHead className="text-center text-siteBlack translate-y-1">
                룸
              </TableHead>
              <TableHead className="w-40 text-center text-siteBlack translate-y-1">
                인원
              </TableHead>
              <TableHead className="w-40 text-center text-siteBlack translate-y-1">
                이용 시간
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations && reservations.length > 0 ? (
              reservations.map((reservation) => (
                <TableRow
                  className="break-keep text-center ~text-xs/base"
                  key={reservation.id}
                >
                  <TableCell className="flex min-w-28 flex-col">
                    <span>{reservation.date}</span>
                    <span>{reservation.time}</span>
                  </TableCell>
                  <TableCell>
                    {parseRoomInfo(reservation.roomType).name}
                  </TableCell>
                  <TableCell className="min-w-28">
                    <div className="flex flex-col items-center">
                      {reservation.men > 0 && (
                        <div>성인 남 {reservation.men}</div>
                      )}
                      {reservation.women > 0 && (
                        <div>성인 여 {reservation.women}</div>
                      )}
                      {reservation.children > 0 && (
                        <div>어린이 {reservation.children}</div>
                      )}
                      {reservation.infants > 0 && (
                        <div>유아 {reservation.infants}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {parseRoomInfo(reservation.roomType).time}분
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="text-center ~text-xs/base">
                <TableCell colSpan={4}>예약 내역이 없습니다.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </article>
    </main>
  );
};

export default page;
