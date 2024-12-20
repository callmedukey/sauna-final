import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

import AccountMenuAside from "../_components/AccountMenuAside";
import ProfileUpdateForm from "./_components/ProfileUpdateForm";

const page = async () => {
  const session = await auth();

  if (!session || !session?.user) return redirect("/");

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
    <main className="px-4  ~pb-[4rem]/[6rem]">
      <AccountMenuAside />
      <article className="mx-auto max-w-screen-md px-4">
        <ProfileUpdateForm user={user} />
      </article>
    </main>
  );
};

export default page;