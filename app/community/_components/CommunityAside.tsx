"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
const CommunityAside = () => {
  const pathname = usePathname();
  return (
    <aside className="page-title mx-auto flex max-w-screen-2xl justify-center font-normal ~mb-[2rem]/[8rem] ~gap-[3.75rem]/[12rem]">
      <Link
        href="/community/notice"
        className={cn(
          "hover:motion-preset-shake",
          pathname.includes("/community/notice") &&
            "font-bold underline underline-offset-4"
        )}
      >
        공지사항
      </Link>
      <Link
        href="/community/inquiry"
        className={cn(
          "hover:motion-preset-shake",
          pathname.includes("/community/inquiry") &&
            "font-bold underline underline-offset-4"
        )}
      >
        문의하기
      </Link>
    </aside>
  );
};

export default CommunityAside;
