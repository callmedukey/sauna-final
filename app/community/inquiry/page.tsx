import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const page = () => {
  return (
    <main className="px-4 ~pt-[3.75rem]/[12rem] ~pb-[4rem]/[6rem]">
      <aside className="page-title mx-auto flex max-w-screen-2xl justify-center font-normal ~mb-[2rem]/[8rem] ~gap-[3.75rem]/[12rem]">
        <Link
          href="/community/notice"
          className={cn("hover:motion-preset-shake")}
        >
          공지사항
        </Link>
        <Link
          href="/community/inquiry"
          className={cn(
            "hover:motion-preset-shake",
            "font-bold underline underline-offset-4"
          )}
        >
          문의하기
        </Link>
      </aside>
      <article className="mx-auto max-w-screen-xl">
        <Table>
          <TableHeader className="border-b border-t-2 border-black ">
            <TableRow className="">
              <TableHead className="w-40 text-center text-siteBlack">
                번호
              </TableHead>
              <TableHead className="text-center text-siteBlack">제목</TableHead>
              <TableHead className="w-40 text-center text-siteBlack">
                날짜
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </article>
    </main>
  );
};

export default page;
