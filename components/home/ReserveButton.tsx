"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { useLoginRegister } from "../layout/LoginRegisterProvider";
import { Button } from "../ui/button";

const ReserveButton = () => {
  const { setLoginOpen } = useLoginRegister();
  const session = useSession();
  return (
    <Button
      className="motion-preset-shake bg-transparent px-6 py-2 text-2xl font-normal ring-1 ring-white"
      variant={"gooeyLeft"}
      asChild
    >
      {session.data ? (
        <Link href="/account/reservation">예약하기</Link>
      ) : (
        <span onClick={() => setLoginOpen(true)}>예약하기</span>
      )}
    </Button>
  );
};

export default ReserveButton;
