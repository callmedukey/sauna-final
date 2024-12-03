"use client";

import { Notice, User } from "@prisma/client";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteNotice } from "../_actions";

interface NoticesTableProps {
  notices: (Notice & {
    user: Pick<User, "name">;
  })[];
}

export function NoticesTable({ notices }: NoticesTableProps) {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell
                  className="font-medium cursor-pointer hover:underline"
                  onClick={() => setSelectedNotice(notice)}
                >
                  {notice.title}
                </TableCell>
                <TableCell>{notice.user.name}</TableCell>
                <TableCell>
                  {format(new Date(notice.createdAt), "yyyy-MM-dd")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">메뉴 열기</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => deleteNotice(notice.id)}
                      >
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedNotice}
        onOpenChange={() => setSelectedNotice(null)}
      >
        <DialogContent className="max-w-screen-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedNotice?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 min-h-[300px] whitespace-pre-wrap">
            {selectedNotice?.content}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
