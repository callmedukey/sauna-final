"use client";

import Image from "next/image";

import FooterLogo from "@/public/footer/footer-logo.svg";

import { useDialog } from "./Providers";

export default function Footer() {
  const { openConditionsDialog, openPrivacyDialog } = useDialog();
  return (
    <>
      <footer className="bg-siteBgGray px-4 py-6 text-siteBlack">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center text-xs sm:flex-row sm:gap-8 sm:[&>*]:w-full xl:[&>*]:w-[revert]">
          {/* Logo section */}
          <div className="hidden xl:block">
            <Image src={FooterLogo} alt="Footer Logo" width={215} height={37} />
          </div>

          <div className="order-2 space-y-1 sm:order-1 xl:order-2 xl:ml-6 xl:space-y-2">
            {/* Company information and contact details */}
            <address className="mt-6 flex flex-col items-center space-y-1 not-italic sm:mt-0 sm:items-start xl:space-y-2">
              {/* Company representative */}
              <p>
                <span className="">대표:</span>
                <span> 김민정</span>
              </p>

              {/* Business registration details */}
              <div className="flex flex-col gap-1 xl:flex-row xl:items-center xl:gap-0 xl:[&>p:first-child]:pr-4 xl:[&>p:last-child]:pl-4 [&>p]:text-center sm:[&>p]:text-left">
                <p className="border-black xl:border-r">
                  <span className="">사업자등록번호:</span>
                  <span> 618-13-36099</span>
                </p>
                <p>
                  <span className="">통신판매업신고번호:</span>
                  <span> 2024-서울동작-0979</span>
                </p>
              </div>

              {/* Physical address */}
              <p>
                <span className="">주소:</span>
                <span>
                  {" "}
                  서울특별시 동작구 노들로 2길 7, 드림스퀘어 A동 206호
                </span>
              </p>

              {/* Email contact */}
              <p>
                <span className="">이메일:</span>
                <span> solosauna_lepo24@naver.com</span>
              </p>
            </address>

            {/* Legal links navigation */}
            <nav
              className="flex items-center justify-center sm:justify-start xl:text-siteGray [&>button:first-child]:border-r [&>button:first-child]:pr-4 [&>button:last-child]:pl-4 [&>button]:text-center sm:[&>button]:text-left"
              aria-label="법적 링크"
            >
              <button
                onClick={openConditionsDialog}
                type="button"
                aria-label="이용약관 보기"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                이용약관
              </button>
              <button
                onClick={openPrivacyDialog}
                type="button"
                aria-label="개인정보처리방침 보기"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                개인정보처리방침
              </button>
            </nav>
          </div>
          <div className="order-1 mx-auto space-y-8 self-start border-siteBlack text-base sm:order-2 sm:ml-auto sm:mr-0 sm:border-l sm:pl-8 xl:order-3 xl:space-y-0 xl:border-none">
            <div className="block xl:hidden">
              <Image
                src={FooterLogo}
                alt="Footer Logo"
                width={215}
                height={37}
              />
            </div>
            <p className="flex flex-col items-center gap-2 sm:items-start xl:gap-1 ">
              <span className="hidden font-bold xl:block">고객센터</span>
              <span className="order-last xl:order-2">TEL: 070-8860-8553</span>
              <span className="flex text-xs text-siteGray xl:order-3">
                <span>운영시간:</span>
                <span className="ml-2 flex flex-col">
                  <span>월 - 목 9:00 - 23:00</span>
                  <span>금 - 일 8:30 - 24:00</span>
                </span>
              </span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
