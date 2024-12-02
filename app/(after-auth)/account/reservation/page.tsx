import { format } from "date-fns";
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
    omit: {
      password: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      date: {
        gte: format(new Date(), "yyyy-MM-dd"),
      },
    },
    select: {
      date: true,
      time: true,
      id: true,
      roomType: true,
    },
  });

  return (
    <main className="px-4 ~pt-[3.75rem]/[12rem] ~pb-[4rem]/[6rem]">
      <ReservationControl reservations={reservations} points={user.point} />
    </main>
  );
};

export default page;
