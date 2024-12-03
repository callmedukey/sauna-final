"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin/users", label: "회원 관리" },
  { href: "/admin/reservations", label: "예약 관리" },
  { href: "/admin/naver", label: "네이버 예약" },
  { href: "/admin/history", label: "전체 내역" },
  { href: "/admin/notices", label: "공지 사항" },
  { href: "/admin/inquiries", label: "문의 관리" },
  { href: "/admin/contents", label: "컨텐츠" },
  { href: "/admin/settings", label: "캘린더/가격 설정" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto">
        <div className="flex items-center gap-6 overflow-x-auto py-4">
          {adminNavItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href + "/") ||
                  pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap text-gray-600 hover:text-gray-900 transition-colors",
                  isActive && "font-semibold text-gray-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
