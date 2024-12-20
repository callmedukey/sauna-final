import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CommunityDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="hover:motion-preset-shake inline-flex justify-center whitespace-nowrap"
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
