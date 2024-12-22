'use client';

import React, { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import PointCheckout from "./PointCheckout";
import AccountMenuAside from "../../_components/AccountMenuAside";
import MessageHandler from "../../history/_components/MessageHandler";

interface PointTransaction {
  date: string;
  description: string;
  points: string;
}

interface PointsClientProps {
  user: {
    point?: number | null;
  };
}

const PointHistoryPopup = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="mx-0 w-auto max-w-2xl bg-white" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const PointsClient = ({ user }: PointsClientProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const transactions: PointTransaction[] = [
    { date: "2024/06/02", description: "회원가입 축하", points: "3000 P" },
    { date: "2024/06/02", description: "포인트 충전", points: "52,500 P" },
    { date: "2024/06/02", description: "포인트 충전", points: "52,500 P" },
    { date: "2024/06/02", description: "포인트 충전", points: "52,500 P" },
  ];

  return (
    <main className="px-4 ~pb-[4rem]/[6rem]">
      <MessageHandler />
      <AccountMenuAside />
      <article className="mx-auto min-h-[min(60vh,40rem)] max-w-screen-md px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-xl font-bold">현재 보유한 포인트는?</h1>
              <p className="text-2xl font-bold">{user.point?.toLocaleString() ?? "0"} P</p>
            </div>
            <button
              className="rounded-[10px] bg-[#998465] px-5 py-2 text-[1.25rem] text-white"
              onClick={() => setIsPopupOpen(true)}
            >
              포인트 충전
            </button>
          </div>
        </div>

        <Table>
          <TableHeader className="border-y border-black bg-white">
            <TableRow className="border-black ~text-xs/[1.25rem]">
              <TableHead className="translate-y-1 text-center text-siteBlack">
                적용날짜
              </TableHead>
              <TableHead className="translate-y-1 text-center text-siteBlack">
                구분
              </TableHead>
              <TableHead className="translate-y-1 text-center text-siteBlack">
                포인트
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow
                key={index}
                className="flex-nowrap break-keep border-none text-center ~text-xs/base"
              >
                <TableCell className="border-none">{transaction.date}</TableCell>
                <TableCell className="border-none">{transaction.description}</TableCell>
                <TableCell className="border-none text-right">{transaction.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </article>

      <PointHistoryPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <article className="mx-auto min-h-[min(60vh,40rem)] max-w-[29rem] border border-siteBlack ~px-[1.5625rem]/[3.625rem] ~py-[1.875rem]/[2.8125rem]">
          <div className="mx-auto max-w-60 border-b border-siteBlack pb-2.5 ~mb-[1.875rem]/[2.8125rem]">
            <h1 className="text-center font-bold ~text-xs/base">보유 포인트</h1>
            <p className="text-center font-bold ~text-base/[1.875rem]">
              {user.point?.toLocaleString() ?? "0"}P
            </p>
          </div>
          <h2 className="text-center font-bold ~text-xs/base">포인트 충전하기</h2>
          <PointCheckout />
        </article>
      </PointHistoryPopup>
    </main>
  );
};

export default PointsClient; 