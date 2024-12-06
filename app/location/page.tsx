import Image from "next/image";
import Script from "next/script";

import Bus from "@/public/location/bus.webp";
import Car from "@/public/location/car.webp";
import Map from "@/public/location/location-1.webp";
import Map2 from "@/public/location/location-2.webp";
import Subway from "@/public/location/train.webp";
import Walk from "@/public/location/walk.webp";

import MapContainer from "./_components/MapContainer";

const page = () => {
  return (
    <main className="mx-auto max-w-screen-2xl px-4 ~pt-[3.75rem]/[5.62rem] ~pb-[3.79rem]/[15rem]">
      <Script
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`}
      />
      <MapContainer />
      <div className="flex-all-center w-full flex-col font-bold ~text-[0.75rem]/base ~mt-[1.87rem]/[3.125rem]">
        <p>주소: 서울특별시 동작구 노들로 2길 7 (드림스퀘어 A동 206호)</p>
        <p>TEL: 070-8860-8553</p>
        <p className="~mt-4/8">
          찾기 어려우실 경우, 편하게 전화 주시면 안내해드리겠습니다.
        </p>
      </div>
      <article className="grid ~mt-[3.75rem]/[5.5rem] ~gap-x-0/[4.81rem] md:grid-cols-2 [&>section>dl]:mt-5 md:[&>section>dl]:~mt-[8.5rem]/[12.5rem]">
        <section className="[&>dl>dd]:text-siteTextGray [&>dl>dd]:~text-[0.75rem]/[1.25rem] [&>dl>dt]:font-bold [&>dl>dt]:text-siteBlack [&>dl>dt]:~text-[1.25rem]/[1.5rem]">
          <Image
            src={Map}
            alt="차량 방문시 지도"
            className="w-full ~h-[15rem]/[25rem]"
          />
          <dl className="">
            <dt className="flex items-center gap-2">
              <Image
                src={Car}
                alt="차량 아이콘"
                className="~size-[1.75rem]/[3.25rem]"
              />
              <span>차량 방문 시</span>
            </dt>
            <dd className="~mt-[1rem]/[1.25rem]">
              ‘노량진 드림스퀘어’를 목적지로 설정해 주세요. 지하2층에 주차하여
              주시기 바랍니다. 부득이하게 3층이하에 주차하신 고객님께서는 전화
              부탁드립니다.
            </dd>
          </dl>
        </section>
        <section className="[&>dl>dd]:text-siteTextGray [&>dl>dd]:~text-[0.75rem]/[1.25rem] [&>dl>dt]:font-bold [&>dl>dt]:text-siteBlack [&>dl>dt]:~text-[1.25rem]/[1.5rem]">
          <Image
            src={Map2}
            alt="차량 방문시 지도"
            className="w-full ~h-[15rem]/[25rem]"
          />
          <dl className="[&>dt:not(:first-child)]:~mt-[1rem]/[1.25rem]">
            <dt className="flex items-center gap-2">
              <Image
                src={Walk}
                alt="도보 아이콘"
                className="~size-[1.75rem]/[3.25rem]"
              />
              <span>도보</span>
            </dt>
            <dd className="~mt-[1rem]/[1.25rem]">
              (노량진 수산시장 방향)지하도를 통해 들어오신 후, 에스컬레이터
              맞은편에 위치한 엘리베이터를 이용해 2층으로 올라오시면 됩니다.
            </dd>
            <dt className="flex items-center gap-2">
              <Image
                src={Subway}
                alt="지하철 아이콘"
                className="~size-[1.75rem]/[3.25rem]"
              />
              <span>지하철</span>
            </dt>
            <dd className="~mt-[1rem]/[1.25rem]">
              1,9호선 노량진역 하차 후 9번출구,7번출구,6번출구 도보 5분거리
            </dd>
            <dt className="flex items-center gap-2">
              <Image
                src={Bus}
                alt="버스 아이콘"
                className="~size-[1.75rem]/[3.25rem]"
              />
              <span>버스</span>
            </dt>
            <dd className="flex flex-col ~mt-[1rem]/[1.25rem]">
              <span>
                노량진수산시장. CTS기독교TV (현대아파트,유한양행(중)방면)
                시내버스 150, 360, 507, 605, 640, 641, 650, N64, 5531, 6211,
                6411, 6515, 8641 마을버스 동작 01, 03, 08, 18 노량진수산시장.
                CTS기독교TV(중) (노량진역(중)방면) 시내버스 150, 360, 507, 605,
                640, 5531, 6211, 6411, 8641
              </span>
              <span>마을버스 동작 01, 03, 08, 18</span>
              <span className="mt-4">
                노량진수산시장. CTS기독교TV(중) (노량진역(중)방면)
              </span>
              <span>
                시내버스 150, 360, 507, 605, 640, 5531, 6211, 6411, 8641
              </span>
              <span className="mb-4">마을버스 동작 01, 03, 08, 18</span>
              <span className="">
                하차 후 (노량진 수산시장 방향)지하도를 통해 들어오신 후,
                에스컬레이터 맞은편에 위치한 엘리베이터를 이용해 2층으로
                올라오시면 됩니다.
              </span>
            </dd>
          </dl>
        </section>
      </article>
    </main>
  );
};

export default page;
