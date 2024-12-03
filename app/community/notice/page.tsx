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
import { NoticeView } from "./_components/notice-view";

export default async function NoticePage() {
  const notices = await prisma.notice.findMany({
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
  });

  return (
    <main className="px-4 ~pt-[3.75rem]/[12rem] ~pb-[4rem]/[6rem]">
      <CommunityAside />
      <article className="mx-auto max-w-screen-xl px-4">
        <div className="min-h-[min(50vh,30rem)]">
          <Table>
            <TableHeader className="border-b border-t-2 border-black">
              <TableRow className="border-black">
                <TableHead className="w-40 text-left lg:text-center text-siteBlack">
                  번호
                </TableHead>
                <TableHead className="text-left lg:text-center text-siteBlack">제목</TableHead>
                <TableHead className="w-40 text-left lg:text-center text-siteBlack">
                  날짜
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.map((notice, index) => (
                <NoticeView 
                  key={notice.id} 
                  notice={notice} 
                  index={notices.length - index} 
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </article>
    </main>
  );
}
