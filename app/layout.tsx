import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const Pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  style: "normal",
});

export const metadata: Metadata = {
  title: "솔로 사우나 - 프리미엄 한국식 사우나",
  description: "현대적인 시설과 전통적인 한국식 사우나의 조화로운 만남",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={cn(`${Pretendard.variable} isolate antialiased`)}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
