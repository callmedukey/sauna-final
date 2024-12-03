"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative h-screen">
      <Image
        src="https://picsum.photos/id/416/1920/1080"
        alt="Sauna Interior"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full flex-col justify-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
            솔로 사우나에서
            <br />
            특별한 휴식을 경험하세요
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-white/90">
            현대적인 시설과 전통적인 한국식 사우나의 조화로운 만남, 도심 속
            최고의 휴식 공간을 만나보세요.
          </p>
          <Link
            href="/booking"
            className="inline-block w-fit rounded-lg bg-white px-8 py-4
                     text-lg font-medium text-black transition-colors
                     hover:bg-gray-100"
          >
            예약하기
          </Link>
        </div>
      </div>
    </div>
  );
}
