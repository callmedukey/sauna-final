"use client";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  AfterAuthLinks,
  AuthLinks,
  HeaderLinks,
} from "@/definitions/constants";

import { useLoginRegister } from "./LoginRegisterProvider";

const MobileMenu = ({
  setLoginOpen,
  setRegisterOpen,
}: {
  setLoginOpen: (loginOpen: boolean) => void;
  setRegisterOpen: (registerOpen: boolean) => void;
}) => {
  const { loginOpen } = useLoginRegister();
  const [open, setOpen] = useState(loginOpen);
  const session = useSession();
  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        className="focus:outline-none xl:hidden"
        aria-label="모바일 메뉴"
      >
        <AlignJustify className="size-10" strokeWidth={1} />
      </DrawerTrigger>
      <DrawerContent className="flex">
        <DialogTitle className="sr-only">모바일 메뉴</DialogTitle>
        <DialogDescription className="sr-only">
          모바일 메뉴 입니다
        </DialogDescription>
        <div className="flex flex-col gap-4 text-siteBlack">
          <div className="mb-8 flex bg-[#F8F8F5] p-6 text-sm [&>a:last-child]:border-l [&>a:last-child]:border-siteBlack [&>a:last-child]:pl-2 [&>button:first-child]:pr-2 [&>button:last-child]:border-l [&>button:last-child]:border-siteBlack [&>button:last-child]:pl-2">
            {session &&
            session.status === "authenticated" &&
            session?.data?.user
              ? AfterAuthLinks.map((link) => {
                  if (link.href === "/logout") {
                    return (
                      <button
                        key={link.href}
                        className="hover:underline"
                        type="button"
                        onClick={async () => {
                          await signOut({ redirectTo: "/" });
                          setOpen(false);
                        }}
                      >
                        {link.label}
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={link.href}
                      href={
                        session.data.user.isAdmin && link.href === "/account"
                          ? "/admin/reservations"
                          : link.href
                      }
                      className="transition-all duration-300 hover:underline"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })
              : AuthLinks.map((link) => (
                  <button
                    key={link.href}
                    className="hover:underline"
                    type="button"
                    onClick={() => {
                      if (link.href === "/login") {
                        setLoginOpen(true);
                        setRegisterOpen(false);
                        setOpen(false);
                      } else if (link.href === "/signup") {
                        setRegisterOpen(true);
                        setLoginOpen(false);
                        setOpen(false);
                      }
                    }}
                  >
                    {link.label}
                  </button>
                ))}
          </div>
          <div className="flex flex-col gap-8 px-6 text-base">
            {HeaderLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                onClick={() => {
                  setOpen(false);
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
