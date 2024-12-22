"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const CommunityDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex justify-center whitespace-nowrap hover:underline hover:underline-offset-4",
            isOpen && "underline underline-offset-4 font-bold",
            pathname.includes("/community") &&
              "underline underline-offset-4 font-bold"
          )}
          aria-haspopup="true"
          aria-expanded="false"
          aria-label="커뮤니티 메뉴 열기"
        >
          커뮤니티
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-24 bg-siteBgGray py-1 text-center"
        align="center"
        sideOffset={8}
      >
        <DropdownMenuItem asChild>
          <Link href="/community/notice" className="w-full justify-center">
            공지 사항
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/community/inquiry" className="w-full justify-center">
            문의하기
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CommunityDropdown;
