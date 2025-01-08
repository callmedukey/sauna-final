import Image from "next/image";
import type { StaticImageData } from "next/image";

import ChildIcon from "@/public/ChildIcon.png";
import ManIcon from "@/public/ManIcon.png";
import WomanIcon from "@/public/WomanIcon.png";

interface PricingItem {
  icon: StaticImageData | StaticImageData[];
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
    icon: WomanIcon,
    title: "여성룸",
    capacity: "1~3 인",
    durations: [
      {
        minutes: "60분",
        regularPrice: 45000,
        discountedPrice: 35000,
        normalnote: "(1인 기준)",
        discountednote:"(인원추가 1인당)",
      },
      {
        minutes: "90분",
        regularPrice: 55000,
        discountedPrice: 35000,
        normalnote: "(1인 기준)",
        discountednote:"(인원추가 1인당)",
      },
    ],
  },
  {
    icon: ManIcon,
    title: "남성룸",
    capacity: "1~3 인",
    durations: [
      {
        minutes: "60분",
        regularPrice: 45000,
        discountedPrice: 35000,
        normalnote: "(1인 기준)",
        discountednote:"(인원추가 1인당)",
      },
      {
        minutes: "90분",
        regularPrice: 55000,
        discountedPrice: 35000,
        normalnote: "(1인 기준)",
        discountednote:"(인원추가 1인당)",
      },
    ],
  },
  {
    icon: [WomanIcon, WomanIcon],
    title: "여성룸 + 대형사우나룸",
    capacity: "2~4 인",
    durations: [
      {
        minutes: "120분",
        regularPrice: 120000,
        discountedPrice: 45000,
        normalnote: "(2인 기준)",
        discountednote:"(인원추가 1인당)",
      },
    ],
  },
  {
    icon: [ManIcon, ManIcon],
    title: "남성룸 + 대형사우나룸",
    capacity: "2~4 인",
    durations: [
      {
        minutes: "120분",
        regularPrice: 120000,
        discountedPrice: 45000,
        normalnote: "(2인 기준)",
        discountednote:"(인원추가 1인당)",
      },
    ],
  },
  {
    icon: [WomanIcon, ManIcon, ChildIcon],
    title: "여성룸 + 남성룸 + 대형사우나룸",
    capacity: "2~6 인",
    durations: [
      {
        minutes: "120분",
        regularPrice: 120000,
        discountedPrice: 45000,
        normalnote: "(2인 기준)",
        discountednote:"(인원추가 1인당)",
      },
    ],
  },
];

export default function Step0() {
  return (
    <div className="w-full px-2 py-3 md:px-0 md:py-20">
      <div className="flex flex-col items-center space-y-2 sm:space-y-2 md:space-y-4">
        {pricingData.map((item, index) => (
          <div 
            key={index} 
            className="xs:w-[95%] relative flex w-[90%] flex-col items-center rounded-[0.625rem] bg-[#FAF9F7] p-1.5 sm:w-[40rem] sm:flex-row sm:items-center sm:gap-x-8 sm:p-2.5 sm:px-8 sm:py-2 md:w-[44rem] md:p-4 lg:w-[48rem]"
          >
            {/* Icon Section */}
            <div className="mb-2 flex min-w-10 items-center justify-center gap-1 sm:mb-0 md:mb-3 md:min-w-14">
              {Array.isArray(item.icon) ? (
                item.icon.map((icon, i) => (
                  <Image
                    key={i}
                    src={icon}
                    alt="icon"
                    width={26.53}
                    height={56}
                    className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
                  />
                ))
              ) : (
                <Image
                  src={item.icon}
                  alt="icon"
                  width={26.53}
                  height={56}
                  className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
                />
              )}
            </div>

            {/* Title and Capacity Section */}
            <div className="mb-2 flex flex-col items-center sm:mb-0 sm:flex-row sm:items-center md:mb-4">
              <span className="whitespace-nowrap text-center text-sm font-bold sm:ml-14 md:min-w-44 md:text-base">
                {item.title}
              </span>
              <span className="whitespace-nowrap text-center text-xs sm:ml-4 sm:text-base md:min-w-16 md:text-sm">
                {item.capacity}
              </span>
            </div>

            {/* Pricing Section */}
            <div className="flex flex-1 justify-center sm:justify-end">
              <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                {item.durations.map((duration, dIndex) => (
                  <div key={dIndex} className="flex items-center gap-2 sm:items-center md:gap-4">
                    <span className="min-w-8 text-[0.6875rem] font-medium md:min-w-12 md:text-xs">
                      {duration.minutes}
                    </span>
                    <div className="flex flex-col gap-0.5 md:gap-1">
                      <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-[0.6875rem] md:text-xs">
                          {duration.regularPrice.toLocaleString()}원
                        </span>
                        <span className="text-[0.6875rem] text-gray-600 md:text-xs">
                          {duration.normalnote}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-[0.6875rem] md:text-xs">
                          {duration.discountedPrice.toLocaleString()}원
                        </span>
                        <span className="text-[0.6875rem] text-gray-600 md:text-xs">
                          {duration.discountednote}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-20 mt-12 flex w-full flex-col items-center space-y-10">
        {/* Child pricing section */}
        <div className="xs:w-[95%] flex w-[90%] items-center justify-center gap-[60px] sm:w-[40rem] md:w-[44rem] lg:w-[48rem]">
          <Image
            src={ChildIcon}
            alt="child icon"
            width={26.53}
            height={56}
            className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
          />
          <div className="flex flex-col items-start space-y-1">
            <p className="text-start text-xs sm:text-sm">
              만 6-12세 어린이는 룸 상관없이 인원추가가 비용 20,000원 입니다.
            </p>
            <p className="text-start text-xs sm:text-sm">
              최대 2명까지 추가 가능하며 제한 인원수에 포함되지 않습니다.
            </p>
            <p className="text-start text-xs sm:text-sm">
              만 6세미만 유아는 입장료 무료 입니다.
            </p>
          </div>
        </div>

        {/* Mixed group usage section */}
        <div className="xs:w-[95%]  flex w-[90%] items-center justify-center gap-[60px] sm:w-[40rem]  lg:w-[48rem]">
          <div className="flex items-center justify-center gap-1">
            <Image
              src={WomanIcon}
              alt="woman icon"
              width={26.53}
              height={56}
              className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
            />
            <Image
              src={ManIcon}
              alt="man icon"
              width={26.53}
              height={56}
              className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
            />
            <Image
              src={ChildIcon}
              alt="child icon"
              width={26.53}
              height={56}
              className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
            />
          </div>
          <div className="flex flex-col items-start space-y-1">
            <p className="text-start text-xs sm:text-sm">
              여성룸+남성룸+대형사우나룸 이용 시
            </p>
            <p className="text-start text-xs sm:text-sm">
              각 룸별 최대수용 인원은 4명입니다.
            </p>
            <p className="text-start text-xs sm:text-sm">
              온실이용 가능 공간은 대형사우나룸에 한정됩니다. (사워룸은 공용으로 사용 불가)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
