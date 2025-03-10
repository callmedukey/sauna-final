"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { cn } from "@/lib/utils";

const AccountMenuAside = () => {
  const pathname = usePathname();
  return (
    <aside className="mx-auto flex max-w-screen-lg flex-wrap place-items-center items-center justify-center gap-y-3.5 font-normal ~text-[1.25rem]/[1.5rem] ~mt-[7.5rem]/[16.875rem] ~mb-[2rem]/[4rem] ~gap-x-[3rem]/[6.25rem]">
      <Link
        href="/account/profile"
        className={cn(
          "hover:underline underline-offset-4 transition-all duration-300",
          pathname === "/account/profile" && "underline font-bold"
        )}
      >
        계정 정보
      </Link>
      <Link
        href="/account/history"
        className={cn(
          "hover:underline underline-offset-4 transition-all duration-300",
          pathname === "/account/history" && "underline font-bold"
        )}
      >
        예약 내역
      </Link>
      <Link
        href="/account/points"
        className={cn(
          "hover:underline underline-offset-4 transition-all duration-300",
          pathname === "/account/points" && "underline font-bold"
        )}
      >
        포인트
      </Link>
    </aside>
  );
};

export default AccountMenuAside;
