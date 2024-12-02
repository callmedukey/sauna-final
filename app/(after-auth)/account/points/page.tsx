import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

import AccountMenuAside from "../_components/AccountMenuAside";
import PointCheckout from "./_components/PointCheckout";
const page = async () => {
  const session = await auth();
  if (!session || !session.user) return redirect("/");
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    omit: {
      password: true,
    },
  });

  if (!user) return redirect("/");

  return (
    <main className="px-4 ~pt-[3.75rem]/[12rem] ~pb-[4rem]/[6rem]">
      <AccountMenuAside />
      <article className="mx-auto min-h-[min(60vh,40rem)] max-w-[29rem] border border-siteBlack ~px-[1.5625rem]/[3.625rem] ~py-[1.875rem]/[2.8125rem] ">
        <div className="mx-auto max-w-60 border-b border-siteBlack ~mb-[1.875rem]/[2.8125rem]">
          <h1 className="text-center font-bold ~text-xs/base">보유 포인트</h1>
          <p className="text-center font-bold ~text-base/[1.875rem]">
            {user?.point?.toLocaleString() ?? "0"}P
          </p>
        </div>
        <h2 className="text-center font-bold ~text-xs/base">포인트 충전하기</h2>
        <PointCheckout />
      </article>
    </main>
  );
};

export default page;
