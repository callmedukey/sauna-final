"use client";

import { Notice, User } from "@prisma/client";
import { format } from "date-fns";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";

interface NoticeViewProps {
  notice: Notice & {
    user: Pick<User, "name">;
  };
  index: number;
}

export function NoticeView({ notice, index }: NoticeViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TableRow className="border-black">
        <TableCell className="text-left lg:text-center">{index}</TableCell>
        <TableCell 
          className="cursor-pointer text-left lg:text-center hover:underline"
          onClick={() => setIsOpen(true)}
        >
          {notice.title}
        </TableCell>
        <TableCell className="text-left lg:text-center">
          {format(new Date(notice.createdAt), "yyyy-MM-dd")}
        </TableCell>
      </TableRow>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-screen-xl p-0">
          <div className="border-b border-gray-200 bg-gray-50 p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {notice.title}
              </DialogTitle>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                <span>{notice.user.name}</span>
                <span>·</span>
                <span>{format(new Date(notice.createdAt), "yyyy년 MM월 dd일")}</span>
              </div>
            </DialogHeader>
          </div>
          <div className="min-h-[300px] space-y-4 p-6">
            <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
              {notice.content}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 