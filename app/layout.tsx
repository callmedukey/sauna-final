import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import { cookies } from "next/headers";

import "./globals.css";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ContentType } from "@prisma/client";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Providers } from "@/components/layout/Providers";
import { cn } from "@/lib/utils";
import { PopupDialog } from "@/components/popup-dialog";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const cookieStore = await cookies();

  // Fetch popup content and cookie
  const [popupContent, hideUntil] = await Promise.all([
    prisma.content.findFirst({
      where: { type: ContentType.POPUP },
    }),
    cookieStore.get("popup_hide_until")?.value,
  ]);

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={cn(`${Pretendard.variable} isolate antialiased`)}>
        <SessionProvider session={session}>
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </SessionProvider>
        <PopupDialog content={popupContent} hideUntil={hideUntil} />
      </body>
    </html>
  );
}
