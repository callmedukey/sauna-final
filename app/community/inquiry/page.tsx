import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import prisma from "@/lib/prisma";

import CommunityAside from "../_components/CommunityAside";
import { InquiryView } from "./_components/inquiry-view";
import { CreateInquiryButton } from "./_components/create-inquiry-button";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function InquiryPage({ searchParams }: PageProps) {
  const searchParamsAwaited = await searchParams;
  const page = Number(searchParamsAwaited.page) || 1;
  const limit = 20;

  const [inquiries, total] = await Promise.all([
    prisma.inquiry.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.inquiry.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="px-4 ~pt-[3.75rem]/[12rem] ~pb-[4rem]/[6rem]">
      <CommunityAside />
      <article className="mx-auto max-w-screen-xl px-4">
        <div className="mb-4 flex justify-end">
          <CreateInquiryButton />
        </div>
        <div className="min-h-[min(50vh,30rem)]">
          <Table>
            <TableHeader className="border-b border-t-2 border-black">
              <TableRow className="border-black">
                <TableHead className="w-40 text-left lg:text-center text-siteBlack">
                  번호
                </TableHead>
                <TableHead className="text-left lg:text-center text-siteBlack">
                  제목
                </TableHead>
                <TableHead className="w-40 text-left lg:text-center text-siteBlack">
                  작성자
                </TableHead>
                <TableHead className="w-40 text-left lg:text-center text-siteBlack">
                  날짜
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry, index) => (
                <InquiryView
                  key={inquiry.id}
                  inquiry={inquiry}
                  index={total - ((page - 1) * limit + index)}
                />
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <a
                    key={pageNum}
                    href={`/community/inquiry?page=${pageNum}`}
                    className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-3 text-sm ${
                      pageNum === page
                        ? "bg-black text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
