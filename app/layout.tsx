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
  metadataBase: new URL('https://solosaunalepo2.co.kr'),
  title: {
    default: '솔로사우나 레포 - 프리미엄 한국식 사우나',
    template: '%s | 솔로사우나 레포'
  },
  description: '서울 최고급 한국식 사우나. 전통 찜질방과 현대적 스파의 완벽한 조화. 힐링, 마사지, 스파 프로그램으로 완벽한 휴식을 제공합니다.',
  keywords: [
    '솔로사우나 레포',
    '한국식 사우나',
    '찜질방',
    '서울 스파',
    '프리미엄 사우나',
    '한국 전통 찜질방',
    '힐링',
    '마사지',
    '휴식',
    '스파 프로그램',
    '한방 스파',
    '럭셔리 스파',
    '서울 웰니스',
    '힐링 스파',
    '프리미엄 스파',
    '전통 찜질',
    '황토방',
    '불가마'
  ],
  authors: [{ name: '솔로사우나 레포' }],
  creator: '솔로사우나 레포',
  publisher: '솔로사우나 레포',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '솔로사우나 레포',
    title: '솔로사우나 레포 - 프리미엄 한국식 사우나',
    description: '서울 최고급 한국식 사우나. 전통 찜질방과 현대적 스파의 완벽한 조화. 힐링, 마사지, 스파 프로그램으로 완벽한 휴식을 제공합니다.',
    images: [
      {
        url: '/carousel-1.webp',
        width: 1200,
        height: 630,
        alt: '솔로사우나 레포 시설 전경',
        type: 'image/webp',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '솔로사우나 레포 - 프리미엄 한국식 사우나',
    description: '서울 최고급 한국식 사우나. 전통 찜질방과 현대적 스파의 완벽한 조화.',
    images: ['/carousel-1.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    other: {
      'naver-site-verification': ['your-naver-site-verification']
    }
  },
  category: '스파 & 웰니스',
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
