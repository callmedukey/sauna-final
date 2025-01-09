import Image from "next/image";

import { cn } from "@/lib/utils";
import How1 from "@/public/how-to-use/how-1.webp";
import How10 from "@/public/how-to-use/how-10.webp";
import How2 from "@/public/how-to-use/how-2.webp";
import How3 from "@/public/how-to-use/how-3.webp";
import How4 from "@/public/how-to-use/how-4.webp";
import How5 from "@/public/how-to-use/how-5.webp";
import How6 from "@/public/how-to-use/how-6.webp";
import How7 from "@/public/how-to-use/how-7.webp";
import How8 from "@/public/how-to-use/how-8.webp";
import How9 from "@/public/how-to-use/how-9.webp";

const data = [
  {
    title: "방문 안내",
    content:
      "방문 당일, 노량진역 9번 출구에서 도보로 3분 거리에 위치한 '노량진 드림스퀘어 상가 2층 [노들역방향] 솔로 사우나_레포(노량진점)’으로 오시면 됩니다.\n\n원활한 이용을 위해 예약 시간 5분 전까지 도착해 주시기 바랍니다.",
    img: How1,
  },
  {
    title: "동의서 작성",
    content:
      "사우나 이용 전 리셉션 데스크 앞 테이블에 앉아 안전 동의서를 숙지하고 동의서에 서명해 주시기 바랍니다.",
    img: How2,
  },
  {
    title: "서비스 안내",
    content:
      "룸 안에는 기본적인 샤워용품이 구비되어 있습니다. 추가로 필요한 용품이 있으시면 리스트를 확인하신 후 직원에게 요청해 주시기 바랍니다. 간단한 웰컴 드링크가 준비되어 있으며, 추가 음료를  원하실 경우 직원에게 구매 요청하실 수 있습니다. 룸 내부에서는 인터폰을 통해 주문이 가능합니다.",
    img: How3,
  },
  {
    title: "온도 조절",
    content:
      "사우나에 들어가기 전 샤워를 하고 몸을 씻으십시오. 이는 더욱 편안한 상태로 땀을 뺄 수 있도록 준비하기 위함입니다. 기본적으로 따뜻한 온도의 물을 욕조에 채워드리지만 시원한 온도를 원하시는 고객님은 방문 최소 1시간 전 연락해 주십시오.",
    img: How4,
  },
  {
    title: "증기 조절 안내",
    content:
      "사우나실에서는 '뢰일리[Loyly]'를 자유롭게 즐길 수 있습니다. '뢰일리'는 사우나 스토브의 사우나 돌에 물을 부어 증기를 발생시키는 방식입니다. 습도를 원하는 수준으로 조절하십시오.",
    img: How5,
  },
  {
    title: "냉수 샤워 반복법",
    content:
      "일반적으로는 사우나와 냉수 샤워를 반복하는 방법이 있습니다. 자유롭게 자신의 원하는 온도로  본인의 페이스에 맞춰 충분히 휴식을 취하며 이용하시길 바랍니다.",
    img: How6,
  },
  {
    title: "휴식 안내",
    content:
      "사우나 또는 입욕을 즐기신 후, 몸을 잘 닦고 누워 더욱 편안한 휴식을 즐기시길 바랍니다.",
    img: How7,
  },
  {
    title: "비상 버튼 및 안전",
    content:
      "각 사우나실에는 비상 버튼이 설치되어 있으니 혹시 몸이 불편하시면 바로 버튼을 누르시거나 인터폰을 통해 저희 직원에게 연락해 주십시오.",
    img: How8,
  },
  {
    title: "퇴실 안내",
    content:
      "이용 시간 완료 후 리셉션 데스크에서 체크아웃 하시면 됩니다. 퇴실 시간은 다음 예약 손님을 위해 꼭 지켜주십시오.",
    img: How9,
  },
  {
    title: "여성 전용 파우더룸",
    content:
      "파우더룸은 여성 전용입니다. 파우더룸 이용 시간은 사우나 이용 시간에 포함되어 있지 않으니 체크아웃 후 이용하시기 바랍니다.",
    img: How10,
  },
];

const page = () => {
  return (
    <main className="px-4 ~pt-[8rem]/[23.5rem] ~pb-[4rem]/[6rem]">
      <h1 className="page-title text-center ~mb-[1rem]/[2rem]">이용방법</h1>
      <p className="whitespace-pre-wrap text-center leading-[175%] text-siteTextGray ~/md:~text-xs/base">
        {`‘솔로 사우나_레포(노량진점)’은 100% 예약제로 운영되고 있습니다.\n사전예약 후 이용 가능합니다.\n\n당사 예약 페이지에서 원하는 날짜와 시간을 예약해 주시기 바랍니다.\n네이버 및 전화예약 가능합니다.\n*방문 당일에는 대기시간 없이 이용 가능합니다`}
      </p>
      <ul className="mx-auto grid max-w-screen-2xl ~mt-16/32 ~gap-y-[3.75rem]/24 md:gap-y-0">
        {data.map((item, i) => (
          <li
            className={cn(
              "flex md:grid md:grid-cols-2",
              i % 2 === 0 ? "flex-col" : "flex-col-reverse"
            )}
            key={item.title}
          >
            {i % 2 === 0 ? (
              <>
                <p className="flex flex-col justify-center gap-y-8 md:pr-20">
                  <span className="text-3xl font-bold">{item.title}</span>
                  <span className="whitespace-pre-wrap text-pretty break-keep leading-[175%] text-siteTextGray">
                    {item.content}
                  </span>
                </p>
                <div className={cn("relative ~h-80/[31.25rem] md:mt-0")}>
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    quality={100}
                    sizes="100vw"
                    className="mt-6 object-cover object-center md:mt-0"
                  />
                </div>
              </>
            ) : (
              <>
                <div className={cn("relative ~h-80/[31.25rem] md:mt-0")}>
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    quality={100}
                    sizes="100vw"
                    className="mt-6 object-cover object-center md:mt-0"
                  />
                </div>
                <p className="flex flex-col justify-center gap-y-8 md:pl-20 ">
                  <span className="text-3xl font-bold">{item.title}</span>
                  <span className="text-pretty break-keep leading-[175%] text-siteTextGray">
                    {item.content}
                  </span>
                </p>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default page;
