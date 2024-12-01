import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

import ReservationControl from "./_components/ReservationControl";

const page = async () => {
  const session = await auth();

  if (!session || !session?.user) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <main className="px-4 ~pt-[3.75rem]/[12rem] ~pb-[4rem]/[6rem]">
      <ReservationControl />
    </main>
  );
};

export default page;
