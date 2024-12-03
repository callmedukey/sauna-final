"use client";

import { Inquiry, User } from "@prisma/client";
import { format } from "date-fns";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteInquiry } from "@/app/(admin)/admin/inquiries/_actions";

interface InquiryViewProps {
  inquiry: Inquiry & {
    user: Pick<User, "name">;
  };
  index: number;
}

export function InquiryView({ inquiry, index }: InquiryViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();

  const canDelete = session.data?.user?.id === inquiry.userId;

  const handleDelete = async () => {
    const result = await deleteInquiry(inquiry.id);
    if (result.success) {
      alert("문의가 삭제되었습니다");
      setIsOpen(false);
    } else {
      alert(result.error);
    }
  };

  return (
    <>
      <TableRow className="border-black">
        <TableCell className="text-left lg:text-center">{index}</TableCell>
        <TableCell
          className="cursor-pointer text-left lg:text-center hover:underline"
          onClick={() => setIsOpen(true)}
        >
          {inquiry.title}
        </TableCell>
        <TableCell className="text-left lg:text-center">
          {inquiry.user.name}
        </TableCell>
        <TableCell className="text-left lg:text-center">
          {format(new Date(inquiry.createdAt), "yyyy-MM-dd")}
        </TableCell>
      </TableRow>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-screen-xl p-0">
          <div className="border-b border-gray-200 bg-gray-50 p-4">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <DialogTitle className="text-2xl font-bold flex-grow">
                  {inquiry.title}
                </DialogTitle>
                {canDelete && (
                  <div className="flex-shrink-0 mr-8">
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
                          onClick={handleDelete}
                        >
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                <span>{inquiry.user.name}</span>
                <span>·</span>
                <span>
                  {format(new Date(inquiry.createdAt), "yyyy년 MM월 dd일")}
                </span>
              </div>
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-12">
              <div className="mt-2 whitespace-pre-wrap text-base leading-relaxed text-gray-700">
                {inquiry.content}
              </div>
              {inquiry.answer && (
                <div className="rounded-lg bg-gray-50 p-6">
                  <div className="mb-4">
                    <h3 className="font-bold">관리자 답변</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {inquiry.answeredAt &&
                        format(
                          new Date(inquiry.answeredAt),
                          "yyyy년 MM월 dd일"
                        )}
                    </p>
                  </div>
                  <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
                    {inquiry.answer}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
