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
    icon: ManIcon,
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
    icon: [WomanIcon, WomanIcon],
    title: "여성룸 + 대형사우나룸",
    capacity: "2~4 인",
    durations: [
      {
        minutes: "120분",
        regularPrice: 120000,
        discountedPrice: 45000,
        normalnote: "(2인 기준)",
        discountednote: "(인원추가 1인당)",
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
        discountednote: "(인원추가 1인당)",
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
        discountednote: "(인원추가 1인당)",
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
            className="xs:w-[95%] relative grid w-[90%] grid-cols-1 sm:grid-cols-[auto_minmax(150px,1fr)_auto] gap-2 sm:gap-8 items-center rounded-[0.625rem] bg-[#FAF9F7] px-1.5 py-2 min-h-[7rem] sm:h-[5.3125rem] sm:w-[40rem] sm:px-8 md:w-[44rem] lg:w-[48rem]"
          >
            {/* Icon Section */}
            <div className="flex items-center justify-center gap-1 w-full sm:w-16">
              {Array.isArray(item.icon) ? (
                item.icon.map((icon, i) => (
                  <Image
                    key={i}
                    src={icon}
                    alt="icon"
                    className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
                  />
                ))
              ) : (
                <Image
                  src={item.icon}
                  alt="icon"
                  className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
                />
              )}
            </div>

            {/* Title and Capacity Section */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-4 items-center w-full">
              <span className="whitespace-nowrap text-sm font-bold md:text-base text-center text-[#212427] justify-self-center">
                {item.title}
              </span>
              <span className="whitespace-nowrap text-xs sm:text-base md:text-sm text-[#212427] justify-self-center sm:justify-self-start">
                {item.capacity}
              </span>
            </div>

            {/* Pricing Section */}
            <div className="w-full sm:w-auto flex justify-center sm:justify-end">
              <div className="w-full grid gap-0.5">
                {item.durations.length > 1 ? (
                  // For 60/90 minutes data
                  <div className="grid grid-cols-2 sm:block sm:space-y-2">
                    {item.durations.map((duration, dIndex, arr) => (
                      <>
                        <div
                          key={dIndex}
                          className="flex flex-col sm:flex sm:flex-row items-center sm:items-center gap-1 sm:gap-2"
                        >
                          <span className="min-w-8 text-[0.6875rem] font-medium md:min-w-12 md:text-xs text-[#212427] mb-0.5 sm:mb-0">
                            {duration.minutes}
                          </span>
                          <div className="flex flex-col items-center sm:items-start gap-0">
                            <div className="flex items-center justify-center sm:justify-start gap-1 md:gap-1.5">
                              <span className="text-[0.6875rem] md:text-xs text-[#212427]">
                                {duration.regularPrice.toLocaleString()}원
                              </span>
                              <span className="text-[0.6875rem] text-[#212427] md:text-xs">
                                {duration.normalnote}
                              </span>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-1 md:gap-1.5">
                              <span className="text-[0.6875rem] md:text-xs text-[#212427]">
                                {duration.discountedPrice.toLocaleString()}원
                              </span>
                              <span className="text-[0.6875rem] text-[#212427] md:text-xs">
                                {duration.discountednote}
                              </span>
                            </div>
                          </div>
                        </div>
                        {index < 2 && dIndex < arr.length - 1 && (
                          <div className="hidden sm:block h-[1px] bg-white w-full my-0.5" />
                        )}
                      </>
                    ))}
                  </div>
                ) : (
                  // For 120 minutes data
                  <div className="flex flex-col sm:flex sm:flex-row items-center sm:items-center gap-1 sm:gap-2">
                    <span className="min-w-8 text-[0.6875rem] font-medium md:min-w-12 md:text-xs text-[#212427] mb-0.5 sm:mb-0">
                      {item.durations[0].minutes}
                    </span>
                    <div className="flex flex-col items-center sm:items-start gap-0">
                      <div className="flex items-center justify-center sm:justify-start gap-1 md:gap-1.5">
                        <span className="text-[0.6875rem] md:text-xs text-[#212427]">
                          {item.durations[0].regularPrice.toLocaleString()}원
                        </span>
                        <span className="text-[0.6875rem] text-[#212427] md:text-xs">
                          {item.durations[0].normalnote}
                        </span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-1 md:gap-1.5">
                        <span className="text-[0.6875rem] md:text-xs text-[#212427]">
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
        <div className="xs:w-[95%] w-[90%] max-w-xl grid grid-cols-[auto_1fr] gap-4 sm:gap-[60px] items-center sm:w-[40rem] md:w-[44rem] lg:w-[48rem]">
          <div className="flex justify-center items-center w-16">
            <Image
              src={ChildIcon}
              alt="child icon"
              width={26.53}
              height={56}
              className="h-auto w-4 object-contain sm:w-[1.658rem] md:w-6"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-xs sm:text-sm text-[#212427] text-left">
              만 6-12세 어린이는 룸 상관없이 인원추가가 비용 20,000원 입니다.
            </p>
            <p className="text-xs sm:text-sm text-[#212427] text-left">
              최대 2명까지 추가 가능하며 제한 인원수에 포함되지 않습니다.
            </p>
            <p className="text-xs sm:text-sm text-[#212427] text-left">
              만 6세미만 유아는 입장료 무료 입니다.
            </p>
          </div>
        </div>

        {/* Mixed group usage section */}
        <div className="xs:w-[95%] w-[90%] max-w-xl grid grid-cols-[auto_1fr] gap-4 sm:gap-[60px] items-center sm:w-[40rem] md:w-[44rem] lg:w-[48rem]">
          <div className="flex justify-center items-center w-16 gap-1">
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
          <div className="flex flex-col space-y-1">
            <p className="text-xs sm:text-sm text-[#212427] text-left">
              여성룸+남성룸+대형사우나룸 이용 시
            </p>
            <p className="text-xs sm:text-sm text-[#212427] text-left">
              각 룸별 최대수용 인원은 4명입니다.
            </p>
            <p className="text-xs sm:text-sm text-[#212427] text-left">
              온실이용 가능 공간은 대형사우나룸에 한정됩니다. (사워룸은 공용으로
              사용 불가)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
