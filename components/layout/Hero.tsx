'use client'

import Image from 'next/image'
import Link from 'next/link'

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
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            솔로 사우나에서<br />
            특별한 휴식을 경험하세요
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            현대적인 시설과 전통적인 한국식 사우나의 조화로운 만남,
            도심 속 최고의 휴식 공간을 만나보세요.
          </p>
          <Link
            href="/booking"
            className="inline-block bg-white text-black px-8 py-4 rounded-lg
                     text-lg font-medium hover:bg-gray-100 transition-colors
                     w-fit"
          >
            예약하기
          </Link>
        </div>
      </div>
    </div>
  )
} 