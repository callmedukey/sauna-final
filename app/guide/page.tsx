import Image from "next/image";

import {
  CarouselMainContainer,
  SliderMainItem,
  CarouselThumbsContainer,
  SliderThumbItem,
  Carousel,
} from "@/components/ui/extension/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FamilyImg1 from "@/public/guide/family/family-1.webp";
import FamilyImg2 from "@/public/guide/family/family-2.webp";
import FamilyImg3 from "@/public/guide/family/family-3.webp";
import FamilyImg4 from "@/public/guide/family/family-4.webp";
import FamilyImg5 from "@/public/guide/family/family-5.webp";
import FamilyInStore from "@/public/guide/family/family-in-store.webp";
import FamilyPerPerson from "@/public/guide/family/family-per-person.webp";
import MensImg1 from "@/public/guide/mens/mens-1.webp";
import MensImg2 from "@/public/guide/mens/mens-2.webp";
import MensImg3 from "@/public/guide/mens/mens-3.webp";
import MensImg4 from "@/public/guide/mens/mens-4.webp";
import MensImg5 from "@/public/guide/mens/mens-5.webp";
import MensInStore from "@/public/guide/mens/mens-in-store.webp";
import MensPerPerson from "@/public/guide/mens/mens-per-person.webp";
import PowderImg1 from "@/public/guide/powder/powder-1.webp";
import PowderImg2 from "@/public/guide/powder/powder-2.webp";
import PowderImg3 from "@/public/guide/powder/powder-3.webp";
import PowderImg4 from "@/public/guide/powder/powder-4.webp";
import PowderInStore from "@/public/guide/powder/powder-in-store.webp";
import WomenInStore from "@/public/guide/womens/women-in-store.webp";
import WomenPerPerson from "@/public/guide/womens/women-per-person.webp";
import WomenImg1 from "@/public/guide/womens/womens-1.webp";
import WomenImg2 from "@/public/guide/womens/womens-2.webp";
import WomenImg3 from "@/public/guide/womens/womens-3.webp";
import WomenImg4 from "@/public/guide/womens/womens-4.webp";
import WomenImg5 from "@/public/guide/womens/womens-5.webp";

const tabData = {
  women: {
    carouselImages: [
      { alt: "womens-1", src: WomenImg1 },
      { alt: "womens-2", src: WomenImg2 },
      { alt: "womens-3", src: WomenImg3 },
      { alt: "womens-4", src: WomenImg4 },
      { alt: "womens-5", src: WomenImg5 },
    ],
    title: "여성 룸",
    description:
      "1인 또는 3인이 이용할 수 있는 욕조 타입 룸으로 가족, 지인, 친구와 함께 [우리만의 프라이빗한 공간] 에서 지친 몸과 마음의 스트레스를 풀고, 일상 속에 힐링을 공유하며, 몸과 마음을 재충전할 수 있는 포근하고 따듯한 공간입니다.\n\n샤워실에는 모던한 타일 바탕에 플랜 테리어로, 식물의 녹색이 시각적인 안정감을 더해주며, 좀 더 자연에서 쉬는 듯한 느낌으로보다 안락하게 목욕을 즐길 수 있습니다.가족, 지인, 친구와 함께 샤워 후 사우나의 열에 익숙해진 몸을 시원하게 식히며,보다 평온하고 행복한 시간을 보내시기 바랍니다.",
    firstImage: WomenInStore,
    secondImage: WomenPerPerson,
  },
  men: {
    carouselImages: [
      { alt: "mens-1", src: MensImg1 },
      { alt: "mens-2", src: MensImg2 },
      { alt: "mens-3", src: MensImg3 },
      { alt: "mens-4", src: MensImg4 },
      { alt: "mens-5", src: MensImg5 },
    ],
    title: "남성 룸",
    description:
      "1인 또는 3인이 이용할 수 있는 욕조 타입 룸으로 가족, 지인, 친구와 함께 [우리만의 프라이빗한 공간] 에서 지친 몸과 마음의 스트레스를 풀고, 일상 속에 힐링을 공유하며, 몸과 마음을 재충전할 수 있는 포근하고 따듯한 공간입니다.\n\n샤워실에는 모던한 타일 바탕에 플랜 테리어로, 식물의 녹색이 시각적인 안정감을 더해주며, 좀 더 자연에서 쉬는 듯한 느낌으로 보다 안락하게 목욕을 즐길 수 있습니다. 가족, 지인, 친구와 함께 샤워 후 사우나의 열에 익숙해진 몸을 시원하게 식히며, 보다 평온하고 행복한 시간을 보내시기 바랍니다.",
    firstImage: MensInStore,
    secondImage: MensPerPerson,
  },
  family: {
    carouselImages: [
      { alt: "family-1", src: FamilyImg1 },
      { alt: "family-2", src: FamilyImg2 },
      { alt: "family-3", src: FamilyImg3 },
      { alt: "family-4", src: FamilyImg4 },
      { alt: "family-5", src: FamilyImg5 },
    ],
    title: "가족 룸",
    description:
      "여유로운 핀란드식 대형 사우나를 갖추고 있어, 보다 넓고 편안한 공간에서 많은 인원이 함께 즐길 수 있는 최적의 환경을 제공합니다. 여성 룸과 남성 룸을 연결하여, 가족 단위가 프라이빗하게함께 할 수 있는 독립된 공간에서 진정한 가족 사우나의 즐거움을 만끽하실 수 있습니다.\n\n지친 몸과 마음의 스트레스를 풀고, 가족과 함께 힐링의 시간을 보내며, 따듯한 사우나와 함께 편안한 휴식을 취할 수 있는 특별한 공간입니다. 자연과 어우러진 인테리어와 함께, 더욱 안락하고평온한 시간을 보내시기 바랍니다.",
    firstImage: FamilyInStore,
    secondImage: FamilyPerPerson,
  },
  powder: {
    carouselImages: [
      { alt: "powder-1", src: PowderImg1 },
      { alt: "powder-2", src: PowderImg2 },
      { alt: "powder-3", src: PowderImg3 },
      { alt: "powder-4", src: PowderImg4 },
    ],
    title: "파우더 룸",
    description:
      "사우나 이용 시간에 포함되어 있지 않는 서비스로 체크아웃 이후에도 이용하실 수 있습니다.\n\n여성 고객님만 이용 가능합니다.",
    firstImage: PowderInStore,
  },
};

const page = async () => {
  return (
    <main className="page-padding px-0">
      <h1 className="page-title">솔로 사우나 레포만의 시설 안내</h1>
      <article className="px-4 ~mt-[2rem]/[4rem]">
        <Tabs defaultValue="women" className="w-full">
          <TabsList className="mx-auto grid w-full max-w-screen-md grid-cols-4 bg-transparent ~mb-[4rem]/[6rem]">
            <TabsTrigger
              value="women"
              className="font-medium underline-offset-4 ~text-base/[1.875rem] data-[state=active]:font-bold data-[state=active]:underline data-[state=active]:shadow-none"
            >
              여성 룸
            </TabsTrigger>
            <TabsTrigger
              value="men"
              className="font-medium underline-offset-4 ~text-base/[1.875rem] data-[state=active]:font-bold data-[state=active]:underline data-[state=active]:shadow-none"
            >
              남성 룸
            </TabsTrigger>
            <TabsTrigger
              value="family"
              className="font-medium underline-offset-4 ~text-base/[1.875rem] data-[state=active]:font-bold data-[state=active]:underline data-[state=active]:shadow-none"
            >
              가족 룸
            </TabsTrigger>
            <TabsTrigger
              value="powder"
              className="font-medium underline-offset-4 ~text-base/[1.875rem] data-[state=active]:font-bold data-[state=active]:underline data-[state=active]:shadow-none"
            >
              파우더 룸
            </TabsTrigger>
          </TabsList>
          <TabsContent value="women">
            <Carousel className="mx-auto max-w-screen-md ">
              <CarouselMainContainer className="aspect-video min-h-[200px] lg:h-[500px]">
                {tabData.women.carouselImages.map((image, index) => (
                  <SliderMainItem
                    key={index}
                    className="relative bg-transparent"
                  >
                    <Image
                      placeholder="blur"
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover object-center"
                      sizes="100vw"
                      priority
                      quality={100}
                    />
                  </SliderMainItem>
                ))}
              </CarouselMainContainer>
              <CarouselThumbsContainer className="relative">
                {tabData.women.carouselImages.map((image, index) => (
                  <SliderThumbItem
                    key={index}
                    index={index}
                    className="h-full bg-transparent"
                  >
                    <div className="flex size-full items-center justify-center rounded-xl bg-background outline outline-1 outline-border">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover object-center"
                        quality={100}
                        priority
                      />
                    </div>
                  </SliderThumbItem>
                ))}
              </CarouselThumbsContainer>
            </Carousel>
            <section className="w-full ~my-[4rem]/[6rem]">
              <h2 className="page-title ~mb-[1.5rem]/[2.5rem]">
                {tabData.women.title}
              </h2>
              <p className="mx-auto max-w-[38.75rem] whitespace-pre-wrap leading-[175%] text-siteTextGray ~/md:~text-xs/base">
                {tabData.women.description}
              </p>
            </section>
            <section className="-mx-4 min-w-full bg-siteBgGray px-4 ~my-[4rem]/[6rem] ~py-[1.25rem]/[3.125rem]">
              <h3 className="page-title ~mb-[1.5rem]/[2.5rem]">
                실내 구비 품목
              </h3>
              <div className="mx-auto max-w-screen-md whitespace-pre-wrap leading-[175%] text-siteTextGray ~/md:~text-xs/base">
                <Image
                  src={tabData.women.firstImage}
                  alt="실내 구비 품목 아이콘 모음"
                  quality={100}
                  placeholder="blur"
                />
              </div>
            </section>
            <section className="w-full ~mt-[4rem]/[6rem] ~pt-[1.25rem]/[3.125rem]">
              <h4 className="page-title flex flex-col gap-1 ~mb-[1.5rem]/[2.5rem]">
                1인 제공 품목
                <span className="text-xs text-siteTextGray">
                  상황에 따라 제공품은 변동될 수 있습니다.
                </span>
              </h4>
              <div className="mx-auto max-w-screen-md whitespace-pre-wrap leading-[175%] text-siteTextGray ~/md:~text-xs/base">
                <Image
                  src={tabData.women.secondImage}
                  alt="1인 제공 품목 아이콘 모음"
                  quality={100}
                  placeholder="blur"
                />
              </div>
            </section>
          </TabsContent>
          <TabsContent value="men">
            <Carousel className="mx-auto max-w-screen-md ">
              <CarouselMainContainer className="aspect-video min-h-[200px] lg:h-[500px]">
                {tabData.men.carouselImages.map((image, index) => (
                  <SliderMainItem
                    key={index}
                    className="relative bg-transparent"
                  >
                    <Image
                      placeholder="blur"
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover object-center"
                      sizes="100vw"
                      priority
                      quality={100}
                    />
                  </SliderMainItem>
                ))}
              </CarouselMainContainer>
              <CarouselThumbsContainer className="relative">
                {tabData.men.carouselImages.map((image, index) => (
                  <SliderThumbItem
                    key={index}
                    index={index}
                    className="h-full bg-transparent"
                  >
                    <div className="flex size-full items-center justify-center rounded-xl bg-background outline outline-1 outline-border">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover object-center"
                        quality={100}
                        priority
                      />
                    </div>
                  </SliderThumbItem>
                ))}
              </CarouselThumbsContainer>
            </Carousel>
            <section className="w-full ~my-[4rem]/[6rem]">
              <h2 className="page-title ~mb-[1.5rem]/[2.5rem]">
                {tabData.men.title}
              </h2>
              <p className="mx-auto max-w-[38.75rem] whitespace-pre-wrap leading-[175%] text-siteTextGray ~/md:~text-xs/base">
                {tabData.men.description}
              </p>
            </section>
            <section className="-mx-4 min-w-full bg-siteBgGray px-4 ~my-[4rem]/[6rem] ~py-[1.25rem]/[3.125rem]">
              <h3 className="page-title ~mb-[1.5rem]/[2.5rem]">
                실내 구비 품목
              </h3>
              <div className="mx-auto max-w-screen-md whitespace-pre-wrap leading-[175%] text-siteTextGray ~/md:~text-xs/base">
                <Image
                  src={tabData.men.firstImage}
                  alt={"실내 구비 품목 아이콘 모음"}
                  quality={100}
                  placeholder="blur"
                />
              </div>
            </section>
            <section className="w-full ~mt-[4rem]/[6rem] ~pt-[1.25rem]/[3.125rem]">
              <h4 className="page-title flex flex-col gap-1 ~mb-[1.5rem]/[2.5rem]">
                1인 제공 품목
                <span className="text-xs text-siteTextGray">
                  상황에 따라 제공품은 변동될 수 있습니다.
                </span>
              </h4>
              <div className="mx-auto max-w-screen-md whitespace-pre-wrap leading-[175%] text-siteTextGray ~/md:~text-xs/base">
                <Image
                  src={tabData.men.secondImage}
                  alt="1인 제공 품목 아이콘 모음"
                  quality={100}
                  placeholder="blur"
                />
              </div>
            </section>
          </TabsContent>
          <TabsContent value="family">
            <Carousel className="mx-auto max-w-screen-md">
              <CarouselMainContainer className="aspect-video min-h-[200px] lg:h-[500px]">
                {tabData.family.carouselImages.map((image, index) => (
                  <SliderMainItem
                    key={index}
                    className="relative bg-transparent"
                  >
                    <Image
                      placeholder="blur"
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover object-center"
                      sizes="100vw"
                      priority
                      quality={100}
                    />
                  </SliderMainItem>
                ))}
              </CarouselMainContainer>
              <CarouselThumbsContainer className="relative">
                {tabData.family.carouselImages.map((image, index) => (
                  <SliderThumbItem
                    key={index}
                    index={index}
                    className="h-full bg-transparent"
                  >
                    <div className="flex size-full items-center justify-center rounded-xl bg-background outline outline-1 outline-border">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover object-center"
                        quality={100}
                        priority
                      />
                    </div>
                  </SliderThumbItem>
                ))}
              </CarouselThumbsContainer>
            </Carousel>
            <section className="w-full ~my-[4rem]/[6rem]">
              <h2 className="page-title ~mb-[1.5rem]/[2.5rem]">
                {tabData.family.title}
              </h2>
              <p className="mx-auto max-w-[38.75rem] whitespace-pre-wrap leading-[175%] text-siteTextGray ~/md:~text-xs/base">
                {tabData.family.description}
              </p>
            </section>
            <section className="-mx-4 min-w-full bg-siteBgGray px-4 ~my-[4rem]/[6rem] ~py-[1.25rem]/[3.125rem]">
              <h3 className="page-title ~mb-[1.5rem]/[2.5rem]">
                실내 구비 품목
              </h3>
              <div className="mx-auto max-w-screen-md whitespace-pre-wrap leading-[175%] text-siteTextGray ~/md:~text-xs/base">
                <Image
                  src={tabData.family.firstImage}
                  alt={"실내 구비 품목 아이콘 모음"}
                  quality={100}
                  placeholder="blur"
                />
              </div>
            </section>
            <section className="w-full ~mt-[4rem]/[6rem] ~pt-[1.25rem]/[3.125rem]">
              <h4 className="page-title flex flex-col gap-1 ~mb-[1.5rem]/[2.5rem]">
                1인 제공 품목
                <span className="text-xs text-siteTextGray">
                  상황에 따라 제공품은 변동될 수 있습니다.
                </span>
              </h4>
              <div className="mx-auto max-w-screen-md whitespace-pre-wrap leading-[175%] text-siteTextGray ~/md:~text-xs/base">
                <Image
                  src={tabData.family.secondImage}
                  alt="1인 제공 품목 아이콘 모음"
                  quality={100}
                  placeholder="blur"
                />
              </div>
            </section>
          </TabsContent>
          <TabsContent value="powder">
            <Carousel className="mx-auto max-w-screen-md ">
              <CarouselMainContainer className="aspect-video min-h-[200px] lg:h-[500px]">
                {tabData.powder.carouselImages.map((image, index) => (
                  <SliderMainItem
                    key={index}
                    className="relative bg-transparent"
                  >
                    <Image
                      placeholder="blur"
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover object-center"
                      sizes="100vw"
                      priority
                      quality={100}
                    />
                  </SliderMainItem>
                ))}
              </CarouselMainContainer>
              <CarouselThumbsContainer className="relative">
                {tabData.powder.carouselImages.map((image, index) => (
                  <SliderThumbItem
                    key={index}
                    index={index}
                    className="h-full bg-transparent"
                  >
                    <div className="flex size-full items-center justify-center rounded-xl bg-background outline outline-1 outline-border">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover object-center"
                        quality={100}
                        priority
                      />
                    </div>
                  </SliderThumbItem>
                ))}
              </CarouselThumbsContainer>
            </Carousel>
            <section className="w-full ~my-[4rem]/[6rem]">
              <h2 className="page-title ~mb-[1.5rem]/[2.5rem]">
                {tabData.powder.title}
              </h2>
              <p className="mx-auto max-w-[38.75rem] whitespace-pre-wrap text-center leading-[175%] text-siteTextGray ~/md:~text-xs/base">
                {tabData.powder.description}
              </p>
            </section>
            <section className="-mx-4 min-w-full bg-siteBgGray px-4 ~mt-[4rem]/[6rem] ~py-[1.25rem]/[3.125rem]">
              <h3 className="page-title ~mb-[1.5rem]/[2.5rem]">
                실내 구비 품목
              </h3>
              <div className="mx-auto max-w-screen-md whitespace-pre-wrap leading-[175%] text-siteTextGray ~/md:~text-xs/base">
                <Image
                  src={tabData.powder.firstImage}
                  alt={"실내 구비 품목 아이콘 모음"}
                  quality={100}
                  placeholder="blur"
                />
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </article>
    </main>
  );
};

export default page;
