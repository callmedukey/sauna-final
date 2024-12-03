"use client";

import { Inquiry, User } from "@prisma/client";
import { format } from "date-fns";
import { useState } from "react";
import { MoreHorizontal, MessageCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { Textarea } from "@/components/ui/textarea";
import { deleteInquiry, answerInquiry } from "../_actions";

interface InquiriesTableProps {
  inquiries: (Inquiry & {
    user: Pick<User, "name">;
  })[];
  currentPage: number;
  totalPages: number;
}

export function InquiriesTable({
  inquiries,
  currentPage,
  totalPages,
}: InquiriesTableProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<
    (Inquiry & { user: Pick<User, "name"> }) | null
  >(null);
  const [answer, setAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const router = useRouter();

  const handleAnswer = async () => {
    if (!selectedInquiry || !answer.trim()) return;
    if (answer.length > 1000) {
      alert("답변은 1000자를 초과할 수 없습니다");
      return;
    }
    
    const result = await answerInquiry(selectedInquiry.id, answer);
    if (result.success) {
      alert("답변이 등록되었습니다");
      setAnswer("");
      setSelectedInquiry(null);
      setIsAnswering(false);
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteInquiry(id);
    if (result.success) {
      alert("문의가 삭제되었습니다");
    } else {
      alert(result.error);
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`/admin/inquiries?page=${page}`);
  };

  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] min-w-[100px]">번호</TableHead>
              <TableHead className="min-w-[400px]">제목</TableHead>
              <TableHead className="w-[150px] min-w-[150px]">날짜</TableHead>
              <TableHead className="w-[120px] min-w-[120px]">상태</TableHead>
              <TableHead className="w-[100px] min-w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry, index) => (
              <TableRow key={inquiry.id}>
                <TableCell className="min-w-[100px]">{inquiries.length - index}</TableCell>
                <TableCell 
                  className="cursor-pointer hover:underline min-w-[400px]"
                  onClick={() => {
                    setSelectedInquiry(inquiry);
                    setIsAnswering(false);
                  }}
                >
                  {truncateText(inquiry.title, 100)}
                </TableCell>
                <TableCell className="min-w-[150px]">
                  {format(new Date(inquiry.createdAt), "yyyy-MM-dd")}
                </TableCell>
                <TableCell className="min-w-[120px]">
                  {inquiry.answer ? (
                    <div className="flex items-center gap-1 text-green-600 whitespace-nowrap">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>답변완료</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">대기중</span>
                  )}
                </TableCell>
                <TableCell className="min-w-[100px]">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        setIsAnswering(true);
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">메뉴 열기</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(inquiry.id)}
                        >
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}

      <Dialog 
        open={!!selectedInquiry} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedInquiry(null);
            setAnswer("");
            setIsAnswering(false);
          }
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-screen-xl max-h-[80vh] p-0 overflow-hidden flex flex-col">
          <div className="border-b border-gray-200 bg-gray-50 p-4">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <DialogTitle className="text-2xl font-bold flex-grow">
                  {selectedInquiry?.title}
                </DialogTitle>
                <div className="flex-shrink-0 mr-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <span className="sr-only">메뉴 열기</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => selectedInquiry && handleDelete(selectedInquiry.id)}
                      >
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                <span>{selectedInquiry?.user.name}</span>
                <span>·</span>
                <span>
                  {selectedInquiry && format(new Date(selectedInquiry.createdAt), "yyyy년 MM월 dd일")}
                </span>
              </div>
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-12">
              <div className="mt-2 whitespace-pre-wrap text-base leading-relaxed text-gray-700">
                {selectedInquiry?.content}
              </div>
              {selectedInquiry?.answer && !isAnswering && (
                <div className="rounded-lg bg-gray-50 p-6">
                  <div className="mb-4">
                    <h3 className="font-bold">관리자 답변</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {selectedInquiry.answeredAt && format(new Date(selectedInquiry.answeredAt), "yyyy년 MM월 dd일")}
                    </p>
                  </div>
                  <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
                    {selectedInquiry.answer}
                  </div>
                </div>
              )}
              {isAnswering && (
                <div className="space-y-4">
                  <h3 className="font-bold">답변 작성</h3>
                  <div className="relative">
                    <Textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="답변을 입력하세요"
                      className="min-h-[200px] resize-none"
                      maxLength={1000}
                    />
                    <div className="absolute right-0 top-0 -translate-y-6 text-sm text-gray-500">
                      {answer.length}/1000
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAnswer}>답변 등록</Button>
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
