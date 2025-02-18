import Image from "next/image";
import React from "react";

import { TextHighlight } from "@/components/ui/text-highlight";
import ChildSvg from "@/public/child-svg.svg";
import ManSvg from "@/public/man-svg.svg";
import WomanSvg from "@/public/woman-svg.svg";

interface PricingItem {
  icon: string | string[];
  title: string;
  capacity: string;
  durations: {
    minutes: string;
    regularPrice: number;
    discountedPrice: number;
    normalnote: string;
    discountednote: string;
  }[];
}

const pricingData: PricingItem[] = [
  {
    icon: WomanSvg.src,
    title: "여성룸",
    capacity: "1~3 인",
    durations: [
      {
        minutes: "60분",
        regularPrice: 45000,
        discountedPrice: 35000,
        normalnote: "(1인 기준)",
        discountednote: "(인원추가 1인당)",
      },
      {
        minutes: "90분",
        regularPrice: 55000,
        discountedPrice: 35000,
        normalnote: "(1인 기준)",
        discountednote: "(인원추가 1인당)",
      },
    ],
  },
  {
    icon: ManSvg.src,
    title: "남성룸",
    capacity: "1~3 인",
    durations: [
      {
        minutes: "60분",
        regularPrice: 45000,
        discountedPrice: 35000,
        normalnote: "(1인 기준)",
        discountednote: "(인원추가 1인당)",
      },
      {
        minutes: "90분",
        regularPrice: 55000,
        discountedPrice: 35000,
        normalnote: "(1인 기준)",
        discountednote: "(인원추가 1인당)",
      },
    ],
  },
  {
    icon: [WomanSvg.src, WomanSvg.src],
    title: "여성룸 + 대형사우나룸",
    capacity: "2~4 인",
    durations: [
      {
        minutes: "100분",
        regularPrice: 120000,
        discountedPrice: 45000,
        normalnote: "(2인 기준)",
        discountednote: "(인원추가 1인당)",
      },
    ],
  },
  {
    icon: [ManSvg.src, ManSvg.src],
    title: "남성룸 + 대형사우나룸",
    capacity: "2~4 인",
    durations: [
      {
        minutes: "100분",
        regularPrice: 120000,
        discountedPrice: 45000,
        normalnote: "(2인 기준)",
        discountednote: "(인원추가 1인당)",
      },
    ],
  },
  {
    icon: [WomanSvg.src, ManSvg.src, ChildSvg.src],
    title: "여성룸 + 남성룸 + 대형사우나룸",
    capacity: "2~6 인",
    durations: [
      {
        minutes: "100분",
        regularPrice: 120000,
        discountedPrice: 45000,
        normalnote: "(2인 기준)",
        discountednote: "(인원추가 1인당)",
      },
    ],
  },
];

export default function Step0() {
  return (
    <div className="w-full px-2 pb-3 md:px-0 md:pb-20">
      <div className="flex flex-col items-center space-y-2 sm:space-y-2 md:space-y-4">
        {pricingData.map((item, index) => (
          <div
            key={index}
            className="xs:w-[95%] relative grid min-h-28 w-[90%] grid-cols-1 items-center gap-2 rounded-[0.625rem] bg-[#FAF9F7] px-1.5 py-2 sm:h-[5.3125rem] sm:w-[40rem] sm:grid-cols-[auto_minmax(150px,1fr)_auto] sm:gap-8 sm:px-8 md:w-[44rem] lg:w-[48rem]"
          >
            {/* Icon Section */}
            <div className="flex w-full items-center justify-center gap-1 sm:w-16">
              {Array.isArray(item.icon) ? (
                item.icon.map((icon, i) => (
                  <Image
                    key={i}
                    src={icon}
                    alt="icon"
                    width={24}
                    height={55}
                    unoptimized
                    className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
                  />
                ))
              ) : (
                <Image
                  src={item.icon}
                  alt="icon"
                  key={index}
                  width={24}
                  height={55}
                  unoptimized
                  className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
                />
              )}
            </div>

            {/* Title and Capacity Section */}
            <div className="grid w-full grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto] sm:gap-4">
              <span className="justify-self-center whitespace-nowrap text-center text-sm font-bold text-[#212427] md:text-base">
                {item.title}
              </span>
              <span className="justify-self-center whitespace-nowrap text-xs text-[#212427] sm:justify-self-start sm:text-base md:text-sm">
                {item.capacity}
              </span>
            </div>

            {/* Pricing Section */}
            <div className="flex w-full justify-center sm:w-auto sm:justify-end">
              <div className="grid w-full gap-0.5">
                {item.durations.length > 1 ? (
                  // For 60/90 minutes data
                  <div className="grid grid-cols-2 sm:block sm:space-y-2">
                    {item.durations.map((duration, dIndex, arr) => (
                      <React.Fragment key={dIndex}>
                        <div
                          key={dIndex}
                          className="flex flex-col items-center gap-1 sm:flex sm:flex-row sm:items-center sm:gap-2"
                        >
                          <span className="mb-0.5 min-w-8 text-[0.6875rem] font-medium text-[#212427] underline decoration-2 underline-offset-2 sm:mb-0 sm:no-underline md:min-w-12 md:text-xs">
                            {duration.minutes}
                          </span>
                          <div className="flex flex-col items-center gap-0 sm:items-start">
                            <div className="flex items-center justify-center gap-1 sm:justify-start md:gap-1.5">
                              <span className="text-[0.6875rem] text-[#212427] md:text-xs">
                                {duration.regularPrice.toLocaleString()}원
                              </span>
                              <span className="text-[0.6875rem] text-[#212427] md:text-xs">
                                {duration.normalnote}
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-1 sm:justify-start md:gap-1.5">
                              <span className="text-[0.6875rem] text-[#212427] md:text-xs">
                                {duration.discountedPrice.toLocaleString()}원
                              </span>
                              <span className="text-[0.6875rem] text-[#212427] md:text-xs">
                                {duration.discountednote}
                              </span>
                            </div>
                          </div>
                        </div>
                        {index < 2 && dIndex < arr.length - 1 && (
                          <div className="my-0.5 hidden h-px w-full bg-white sm:block" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  // For 120 minutes data
                  <div className="flex flex-col items-center gap-1 sm:flex sm:flex-row sm:items-center sm:gap-2">
                    <span className="mb-0.5 min-w-8 text-[0.6875rem] font-medium text-[#212427] underline decoration-2 underline-offset-2 sm:mb-0 sm:no-underline md:min-w-12 md:text-xs">
                      {item.durations[0].minutes}
                    </span>
                    <div className="flex flex-col items-center gap-0 sm:items-start">
                      <div className="flex items-center justify-center gap-1 sm:justify-start md:gap-1.5">
                        <span className="text-[0.6875rem] text-[#212427] md:text-xs">
                          {item.durations[0].regularPrice.toLocaleString()}원
                        </span>
                        <span className="text-[0.6875rem] text-[#212427] md:text-xs">
                          {item.durations[0].normalnote}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1 sm:justify-start md:gap-1.5">
                        <span className="text-[0.6875rem] text-[#212427] md:text-xs">
                          {item.durations[0].discountedPrice.toLocaleString()}원
                        </span>
                        <span className="text-[0.6875rem] text-[#212427] md:text-xs">
                          {item.durations[0].discountednote}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-20 mt-12 flex w-full flex-col items-center space-y-10 ">
        {/* Child pricing section */}
        <div className="xs:w-[95%] grid w-[90%] max-w-xl grid-cols-[auto_1fr] items-center gap-4 sm:w-[40rem] sm:gap-[60px] md:w-[44rem] lg:w-[48rem]">
          <div className="flex w-16 items-center justify-center">
            <Image
              src={ChildSvg.src}
              alt="child icon"
              width={21}
              height={42}
              unoptimized
              className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-left text-xs text-[#212427] sm:text-sm">
              <TextHighlight>만 6-12세 어린이</TextHighlight>는 룸 상관없이
              인원추가가 <TextHighlight>비용 20,000원</TextHighlight> 입니다.
            </p>
            <p className="text-left text-xs text-[#212427] sm:text-sm">
              최대 2명까지 추가 가능하며 제한 인원수에 포함되지 않습니다.
            </p>
            <p className="text-left text-xs text-[#212427] sm:text-sm">
              <TextHighlight>만 6세미만 유아</TextHighlight>는 입장료 무료
              입니다.
            </p>
          </div>
        </div>

        {/* Mixed group usage section */}
        <div className="xs:w-[95%] grid w-[90%] max-w-xl grid-cols-[auto_1fr] items-center gap-4 sm:w-[40rem] sm:gap-[60px] md:w-[44rem] lg:w-[48rem]">
          <div className="flex w-16 items-center justify-center gap-1">
            <Image
              src={WomanSvg.src}
              alt="woman icon"
              width={26}
              height={55}
              unoptimized
              className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
            />
            <Image
              src={ManSvg.src}
              alt="man icon"
              width={22}
              height={55}
              unoptimized
              className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
            />
            <Image
              src={ChildSvg.src}
              alt="child icon"
              width={21}
              height={42}
              unoptimized
              className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-left text-xs text-[#212427] sm:text-sm">
              <TextHighlight>여성룸+남성룸+대형사우나룸</TextHighlight> 이용 시
            </p>
            <p className="text-left text-xs text-[#212427] sm:text-sm">
              각 룸별 최대수용 인원은 4명입니다.
            </p>
            <p className="text-left text-xs text-[#212427] sm:text-sm">
              온실이용 가능 공간은 대형사우나룸에 한정됩니다. (사워룸은 공용으로
              사용 불가)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
