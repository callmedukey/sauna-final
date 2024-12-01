import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CommunityAside from "../_components/CommunityAside";

const page = () => {
  return (
    <main className="px-4 ~pt-[3.75rem]/[12rem] ~pb-[4rem]/[6rem]">
      <CommunityAside />
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
