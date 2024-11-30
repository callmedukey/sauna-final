import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const page = () => {
  return (
    <main className="px-4 ~pt-[3.75rem]/[12rem] ~pb-[4rem]/[6rem]">
      <aside className="page-title mx-auto flex max-w-screen-2xl justify-center font-normal ~mb-[2rem]/[4rem] ~gap-[3.75rem]/[12rem]">
        <Link
          href="/community/notice"
          className={cn("hover:motion-preset-shake")}
        >
          공지사항
        </Link>
        <Link
          href="/community/inquiry"
          className={cn("hover:motion-preset-shake")}
        >
          문의하기
        </Link>
      </aside>
      <article className="mx-auto max-w-screen-xl">
        <Skeleton className="min-h-[min(60vh,40rem)] rounded-lg" />
      </article>
    </main>
  );
};

export default page;
