import { format } from "date-fns";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PointTypeMapping } from "@/definitions/constants";
import prisma from "@/lib/prisma";

import PointsClient from "./_components/points-client";

const Page = async () => {
  const session = await auth();
  if (!session || !session.user) return redirect("/");

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    omit: {
      password: true,
    },
    include: {
      pointPayments: {
        include: {
          usedOn: { select: { id: true, createdAt: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!user) return redirect("/");

  return (
    <PointsClient
      user={user}
      transactions={[
        {
          date: format(user.createdAt, "yyyy/MM/dd"),
          description: "회원가입 축하",
          points: 3000,
          pointType: "SIGNUP",
        },
        ...user?.pointPayments.map((payment) => ({
          date: format(payment.createdAt, "yyyy/MM/dd"),
          description: PointTypeMapping[payment.pointType],
          points: payment.points,
          pointType: payment.pointType,
          reservationId: payment.reservationId ?? undefined,
        })),
      ]}
    />
  );
};

export default Page;
