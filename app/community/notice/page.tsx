import {
  Table,
  TableBody,
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
            <TableHeader className="border-b border-t-2 border-black whitespace-nowrap">
              <TableRow className="border-black">
                <TableHead className="lg:w-40 text-left lg:text-center text-siteBlack whitespace-nowrap translate-y-1">
                  번호
                </TableHead>
                <TableHead className="text-left lg:text-center text-siteBlack whitespace-nowrap max-w-[10rem] translate-y-1">
                  제목
                </TableHead>
                <TableHead className="lg:w-40 text-left lg:text-center text-siteBlack whitespace-nowrap translate-y-1">
                  날짜
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="whitespace-nowrap">
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
