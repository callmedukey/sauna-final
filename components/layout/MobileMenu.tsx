"use client";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { AuthLinks, HeaderLinks } from "@/definitions/constants";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
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
          <div className="mb-8 flex bg-[#F8F8F5] p-6 text-sm [&>a:first-child]:pr-2 [&>a:last-child]:border-l [&>a:last-child]:border-siteBlack [&>a:last-child]:pl-2">
            {AuthLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-8 px-6 text-base">
            {HeaderLinks.map((link) => (
              <Link href={link.href} key={link.href}>
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
