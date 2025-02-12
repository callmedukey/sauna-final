"use client";

import { PointType } from "@prisma/client";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import PointHistoryPopup from "./PointHistoryPopup";
import AccountMenuAside from "../../_components/AccountMenuAside";
import MessageHandler from "../../history/_components/MessageHandler";

interface PointTransaction {
  date: string;
  description: string;
  points: number;
  pointType: PointType;
  reservationId?: string;
}

interface PointsClientProps {
  user: {
    point?: number | null;
  };
  transactions: PointTransaction[];
}

const PointsClient = ({ user, transactions }: PointsClientProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <main className="px-4 ~pb-[4rem]/[6rem]">
      <MessageHandler />
      <AccountMenuAside />
      <div className="mx-auto flex max-w-screen-3xl flex-col items-center justify-center gap-4 text-pretty break-keep border bg-[#e5e5e5] text-center ~my-[2rem]/[4rem] ~p-[1.5rem]/[3.75rem]">
        <h1 className="font-bold text-[#b10000] ~text-[1rem]/[1.5rem]">
          솔로사우나 레포_노량진점에서 포인트는 다음과 같이 적립/적용됩니다.
        </h1>
        <p className="mt-2 text-left font-medium ~text-base/lg md:text-center">
          포인트는 결제한 금액에 5%가 자동 적립됩니다. (포인트를 사용하여 결제한
          경우, 사용된 포인트에 대해서는 차감 적립됩니다.)
          <br />
          직접 충전하여 포인트 사용이 가능하며 포인트 구매는 50,000원 부터
          가능합니다.
          <br />
          충전 시 충전한 금액에 5%가 추가 적립됩니다.
        </p>
      </div>
      <article className="mx-auto min-h-[min(60vh,40rem)] max-w-screen-md px-4">
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="mb-2 text-xl font-bold">현재 보유한 포인트는?</h1>
              <p className="text-2xl font-bold">
                {user.point?.toLocaleString() ?? "0"} P
              </p>
            </div>
            <button
              type="button"
              className="rounded-[10px] bg-[#998465] px-5 py-2 text-white ~text-base/[1.25rem]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPopupOpen(true);
              }}
            >
              포인트 충전
            </button>
          </div>
        </div>

        <Table>
          <TableHeader className="border-y border-black bg-white">
            <TableRow className="border-black bg-[#e5e5e5]/10 ~text-xs/[1.25rem]">
              <TableHead className=" text-center text-siteBlack">
                적용날짜
              </TableHead>
              <TableHead className=" text-center text-siteBlack">
                구분
              </TableHead>
              <TableHead className=" text-center text-siteBlack">
                포인트
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <TableRow
                  key={index}
                  className="flex-nowrap break-keep border-none text-center ~text-xs/base"
                >
                  <TableCell className="border-none">
                    {transaction.date}
                  </TableCell>
                  <TableCell className="border-none">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="border-none text-right">
                    {transaction.points.toLocaleString()}P
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={100}>
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center font-bold ~text-xs/base">
                      포인트 내역이 없습니다.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </article>

      <PointHistoryPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        user={user}
      />
    </main>
  );
};

export default PointsClient;
