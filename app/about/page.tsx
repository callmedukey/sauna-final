import Image from "next/image";
import React from "react";

import { cn } from "@/lib/utils";
import About1 from "@/public/about/about-1.webp";
import About2 from "@/public/about/about-2.webp";
import About3 from "@/public/about/about-3.webp";

const data = [
  {
    title: "Story of Solo Sauna Lepo",
    content:
      "솔로 사우나 레포는 에스토니아 문화에서 유래한 핀란드식 사우나를 현대적인 방식으로 만들어낸 휴식 공간입니다. 프라이빗하고 아늑한 공간에서 타인의 시선이나 접촉을 방해받지 않고 걱정할필요가 없는 오직 나만의 시간. 사우나에서 몸과 마음을 씻으며 자신의 내면에 차오르는 평화로운 감정을 만끽해 보시기 바랍니다.",
    image: About3,
  },
  {
    title: `사우나는 핀란드어로 \n'증기 목욕'을 의미합니다`,
    content:
      "핀란드의 경우 사우나가 있는 가정은 드문 일이 아닙니다. 사우나 문화는 핀란드에서 세계로 퍼져나가 많은 전 세계 사람들이 사우나를 즐기고 있습니다. 핀란드식 사우나에는 고온으로 가열된 사우나 스톤 위에 물을 부어 증기를 발생시키고, 사우나실의 습도와 온도를 올리면서 체온이 상승하고, 이로 인한 발열로 몸에 있는 노폐물을 밖으로 노출시킵니다. \n\n 또한 아로마 오일로 첨가된 물(AROMA WATER)을 사용하여 사우나 스톤에 부어 실내 온도를 한 번에 올리고 이로 인한 증기로 목욕을 하는 것을 LÖYLY(뤄울루)라고 합니다.",
    image: About2,
  },
  {
    title: "핀란드 사우나 효과",
    content: `핀란드식 사우나는 온도와 습도를 조절할 수 있기 때문에 너무 덥고 습도가 낮은 건식 사우나를 좋아하지 않더라도 핀란드식 사우나를 편하게 사용할 수 있습니다. 핀란드식 사우나는 원적외선 효과뿐만 아니라 음이온이 풍부한 수증기가 몸의 심부에 발한을 촉진하고 신진대사와 피로 회복, 해독 등 몸에 많은 이로운 작용을 하는 것으로 알려져 있습니다. \n\n 핀란드 사우나 문화의 또 다른 필수적인 부분은 "Vihita"입니다. 그것은 자작나무의 어린잎으로 낱단으로 만들어지며, 그냥 매달아 사우나 룸은 숲의 향기로 가득 차게 됩니다. SOLO SAUNA LEPO에서 자신만의 사우나를 즐기시기 바랍니다.`,
    image: About1,
  },
];

const AboutPage = () => {
  return (
    <main className="page-padding">
      <h1 className="page-title">솔로사우나a 레포 소개</h1>
      <article className="mx-auto grid max-w-screen-xl gap-y-8 whitespace-pre-wrap lg:grid-cols-2 lg:gap-y-0">
        {data.map((item, index) => {
          if (index === 1) {
            return (
              <React.Fragment key={item.title}>
                <div
                  className={cn(
                    "relative ~h-80/48 md:h-[30rem] order-4 lg:order-3"
                  )}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    quality={100}
                    sizes="100vw"
                    className="object-fill object-center xl:object-cover"
                  />
                </div>
                <div
                  className={cn(
                    "flex flex-col items-start justify-center gap-10 lg:pl-16 order-3 lg:order-4"
                  )}
                >
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                  <p className="text-pretty break-keep leading-[175%] text-siteTextGray">
                    {item.content}
                  </p>
                </div>
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment key={item.title}>
                <div
                  className={cn(
                    "flex flex-col items-start justify-center gap-10 lg:pr-16",
                    index === 2 && "order-5"
                  )}
                >
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                  <p className="text-pretty break-keep leading-[175%] text-siteTextGray">
                    {item.content}
                  </p>
                </div>
                <div
                  className={cn(
                    "relative ~h-80/48 md:h-[30rem]",
                    index === 2 && "order-6"
                  )}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="100vw"
                    className="object-fill object-center xl:object-cover"
                  />
                </div>
              </React.Fragment>
            );
          }
        })}
      </article>
    </main>
  );
};

export default AboutPage;
