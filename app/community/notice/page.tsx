import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <main className="px-4 ~pt-[8rem]/[16.875rem] ~pb-[4rem]/[6rem]">
      <CommunityAside />
      <article className="mx-auto max-w-screen-xl px-4">
        <div className="min-h-[min(50vh,30rem)]">
          <Table className="overflow-hidden scrollbar-hide">
            <TableHeader className="whitespace-nowrap border-b border-t-2 border-black">
              <TableRow className="border-black">
                <TableHead className=" whitespace-nowrap text-left text-siteBlack lg:w-40 lg:text-center">
                  번호
                </TableHead>
                <TableHead className="max-w-40 whitespace-nowrap text-left text-siteBlack lg:text-center">
                  제목
                </TableHead>
                <TableHead className="whitespace-nowrap text-left text-siteBlack lg:w-40 lg:text-center">
                  날짜
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="whitespace-nowrap scrollbar-hide">
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
