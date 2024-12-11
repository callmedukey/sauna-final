"use client";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";

import Background1 from "@/public/home/carousel/carousel-1.webp";
import Background2 from "@/public/home/carousel/carousel-2.webp";
import Background3 from "@/public/home/carousel/carousel-3.webp";
import Background4 from "@/public/home/carousel/carousel-4.webp";
import Background5 from "@/public/home/carousel/carousel-5.webp";
import Background6 from "@/public/home/carousel/carousel-6.webp";
import Background7 from "@/public/home/carousel/carousel-7.webp";

import { Button } from "../ui/button";

const imagesArray = [
  Background1,
  Background2,
  Background3,
  Background4,
  Background5,
  Background6,
  Background7,
];

const BackgroundCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000 }),
  ]);

  return (
    <div className="relative isolate">
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 px-4 text-center text-white">
        <h1 className="font-bold ~text-4xl/5xl">
          나만을 위한 사우나 <br className="xl:hidden" /> 솔로 사우나 레포
        </h1>
        <p className="font-medium ~text-lg/xl">
          국내 최초의 개인실 사우나 <br className="xl:hidden" /> 프라이빗 한
          공간에서 본인만의 휴식을
        </p>
        <Button
          className="motion-preset-shake bg-transparent px-6 py-2 text-2xl font-normal ring-1 ring-white"
          variant={"gooeyLeft"}
          asChild
        >
          <Link href="/account/reservation">예약하기</Link>
        </Button>
      </div>
      <div
        className="pointer-events-none relative isolate mx-auto h-screen w-full overflow-hidden"
        ref={emblaRef}
      >
        <div className=" pointer-events-none flex h-full">
          {imagesArray.map((image, index) => (
            <div key={index} className=" relative size-full shrink-0">
              <div className="dark-gradient absolute inset-0 z-50" />
              <Image
                src={image.src}
                alt={`carousel-${index}`}
                fill
                quality={100}
                priority={index < 3}
                className="-z-10 object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackgroundCarousel;
