import { redirect } from "next/navigation";

import { auth } from "@/auth";
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
  });

  if (!user) return redirect("/");

  return <PointsClient user={user} />;
};

export default Page;
