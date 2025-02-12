"use client";
import Image from "next/image";
import { useState } from "react";

import { useDialog } from "@/components/layout/Providers";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import IconClock from "@/public/icon-clock.png";
import IconDont from "@/public/icon-dont.png";
import IconExclamation from "@/public/icon-exclamation.png";
import IconGas from "@/public/icon-gas.png";
import IconMenu from "@/public/icon-menu.png";

const PrecautionsContent = ({
  setShowPrecautions,
}: {
  setShowPrecautions: (show: boolean) => void;
}) => {
  const [agreement, setAgreement] = useState(false);
  const { openConditionsDialog } = useDialog();

  return (
    <div className="mx-auto 2xl:max-w-screen-3xl">
      <h1 className="text-center font-bold ~text-[1.5rem]/[2.25rem] ~mt-[7.5rem]/[11.625rem] ~mb-[4rem]/[6.25rem]">
        예약하기
      </h1>
      <div className="flex flex-col items-center justify-center gap-4 text-pretty break-keep border bg-[#e5e5e5] text-center ~p-[1.5rem]/[3.75rem]">
        <h1 className="font-bold text-[#b10000] ~text-[1rem]/[1.5rem]">
          사우나 이용 시 주의사항
        </h1>
        <p className="mt-2 font-medium ~text-base/lg">
          음주 시에는 본 시설을 이용 할 수 없습니다.
          <br />
          의사가 입욕을 금지한 경우, 아래의 나열된 건강 상태 중 하나라도
          해당되는 경우와 컨디션이 좋지 않은 경 우에는 사우나 이용을 삼가해
          주시기 좋지 않은 경 우에는 사우나 이용을 삼가해 주시기 바랍니다.
        </p>
        <p className="font-medium text-[#B10000] ~text-base/lg">
          {" "}
          ※ 예약시간 5분 전에 도착해 주시기 바랍니다.
        </p>
      </div>

      <div className="break-keep border-y border-y-[#999999] px-4 ~mt-[1.5rem]/[3.75rem]">
        {/* Health conditions section */}
        <div className="flex flex-col gap-[3.125rem] bg-white px-4 py-[1.875rem] xl:flex xl:flex-row">
          <div className="flex items-start gap-2 ~text-[1rem]/lg xl:min-w-[270px]">
            <Image
              src={IconExclamation}
              alt="Warning icon"
              width={24}
              height={24}
            />
            <h2 className="">사우나를 이용할 수 없는 건강 상태</h2>
          </div>
          <ul className="flex flex-col space-y-4 font-medium ~text-[1rem]/lg xl:space-y-2">
            <li className="flex gap-2">
              <span className="min-w-[10px]">-</span>
              <span>수축기 혈압이 180mmhg 이상인 상태</span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px]">-</span>
              <span>백내장이 우려되거나 안면부종증이 있는 상태</span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px]">-</span>
              <span>
                급성질환(발열이 있는 경우), 심부전, 호흡성 질환, 파킨슨병, 심한
                빈혈, 임신 또는 임신 가능성이 있는 경우
              </span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px]">-</span>
              <span>
                전염성 질병, 폐결핵, 악성종양, 중증 심장병, 호흡부전, 급수부전
              </span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px]">-</span>
              <span>최근에 수술을 받은 이력이 있는 경우</span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px]">-</span>
              <span>출혈 또는 월경으로 인한 출혈이 있는 경우</span>
            </li>
            <li className="flex gap-2 text-[#B10000]">
              <span className="min-w-[10px]">※</span>
              <span>
                위와 같은 경우 입장이 제한 되는 점 양해 부탁드립니다 ※
              </span>
            </li>
          </ul>
        </div>

        {/* Restricted section */}
        <div className="flex flex-col gap-[3.125rem] border-y border-y-[#e5e5e5] bg-white px-4 py-[1.875rem] xl:flex-row">
          <div className="flex items-start gap-2 ~text-[1rem]/lg xl:min-w-[270px]">
            <Image
              src={IconDont}
              alt="Restricted icon"
              width={24}
              height={24}
            />
            <h2 className="">사우나를 중단하여야 하는 경우</h2>
          </div>
          <ul className="flex flex-col space-y-4 font-medium ~text-[1rem]/lg xl:space-y-2">
            <li className="flex gap-2">
              <span className="min-w-[10px]">-</span>
              <span>열균형이 급격히 깨졋던 경우</span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px]">-</span>
              <span>입술이 감자기 자주빛으로 변한 경우</span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px]">-</span>
              <span>심장에 이상을 느낀 경우</span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px]">-</span>
              <span>감각 기관에서 심한 두통을 느낀 경우</span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px]">-</span>
              <span>발작과 이상 감각(둔한 통증)을 느낀 경우</span>
            </li>
          </ul>
        </div>

        {/* Additional notes */}
        <div className="flex flex-col gap-[3.125rem] border-b border-b-[#e5e5e5] bg-white px-4 py-[1.875rem] xl:flex-row">
          <div className="flex items-start gap-2 ~text-[1rem]/lg xl:min-w-[270px]">
            <Image
              src={IconExclamation}
              alt="Notes icon"
              width={24}
              height={24}
            />
            <h2 className="">주가 확인사항</h2>
          </div>
          <ul className="flex flex-col space-y-4 font-medium ~text-[1rem]/lg xl:space-y-2">
            <li className="flex gap-2">
              <span className="min-w-[10px] shrink-0">-</span>
              <span className="flex-1">
                고혈압, 생활습관 관련 질환(당뇨병, 심장병, 뇌졸증, 만성질환)이
                있는 고객께서는 장시간 사우나 이용 또는 냉수 샤워를 삼가해
                주시기 바랍니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px] shrink-0">-</span>
              <span className="flex-1">
                안전, 악세사리(목걸이, 귀걸이, 반지, 팔찌, 발찌, 그 외에 금속
                장신구)를 착용 후 사우나를 즐기실 경우 화상을 입거나 악세사리
                변형, 변색이 될 수 있으므로 준비해둔 귀중품 트레이에 보관해
                주시길 바랍니다
              </span>
            </li>
          </ul>
        </div>

        {/* Fire safety */}
        <div className="flex flex-col gap-[3.125rem] border-b border-b-[#e5e5e5] bg-white px-4 py-[1.875rem] xl:flex-row">
          <div className="flex items-start gap-2 ~text-[1rem]/lg xl:min-w-[270px]">
            <Image
              src={IconGas}
              alt="Fire safety icon"
              width={24}
              height={24}
            />
            <h2 className="">룸 유형 안내</h2>
          </div>
          <ul className="flex flex-col space-y-4 font-medium ~text-[1rem]/lg xl:space-y-2">
            <li className="flex gap-2">
              <span className="min-w-[10px] shrink-0">-</span>
              <span className="flex-1">
                성별 및 인원수에 맞는 룸 유형을 선택가능 합니다.
              </span>
            </li>
          </ul>
        </div>

        {/* Reservation time */}
        <div className="flex flex-col gap-[3.125rem] border-b border-b-[#e5e5e5] bg-white px-4 py-[1.875rem] xl:flex-row">
          <div className="flex items-start gap-2 ~text-[1rem]/lg xl:min-w-[270px]">
            <Image src={IconClock} alt="Time icon" width={24} height={24} />
            <h2 className="">예약 관련 사항</h2>
          </div>
          <ul className="flex flex-col space-y-4 font-medium ~text-[1rem]/lg xl:space-y-2">
            <li className="flex gap-2">
              <span className="min-w-[10px] shrink-0">-</span>
              <span className="flex-1">
                원하시는 예약 시간대가 없을 경우, 전화 주시면 변경이 가능합니다.
              </span>
            </li>
          </ul>
        </div>

        {/* Cancellation policy */}
        <div className="flex flex-col gap-[3.125rem] bg-white px-4 py-[1.875rem] xl:flex-row">
          <div className="flex items-start gap-2 ~text-[1rem]/lg xl:min-w-[270px]">
            <Image
              src={IconMenu}
              alt="Cancellation icon"
              width={24}
              height={24}
            />
            <h2 className="">
              예약/변경/환불/취소 시<br className="hidden xl:block" />
              주의할 점
            </h2>
          </div>
          <ul className="flex flex-col space-y-4 font-medium ~text-[1rem]/lg xl:space-y-2">
            <li className="flex gap-2">
              <span className="min-w-[10px] shrink-0">-</span>
              <span className="flex-1">
                예약은 회원/비회원 둘 다 이용 가능하나, 비회원의 경우 포인트
                적립 및 조회이 불가합니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px] shrink-0">-</span>
              <span className="flex-1">
                예약일 기준 2일 전 취소 시 취소 수수료 30% 부과.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px] shrink-0">-</span>
              <span className="flex-1">
                예약일 기준 1일 전 취소 시 취소 수수료 50% 부과.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px] shrink-0">-</span>
              <span className="flex-1">
                예약일 기준 당일 취소 시 취소 수수료 100% 부과.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px] shrink-0">-</span>
              <span className="flex-1">
                자체 예약 변경이 불가능 하니, 전화 주시면 예약 변경 가능 합니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px] shrink-0">-</span>
              <span className="flex-1">
                이용당일 모든 변경 및 취소는 불가하며 변경을 원하실 경우 최소
                이틀 전까지 요청해 주시기 바랍니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="min-w-[10px] shrink-0">-</span>
              <span className="flex-1">
                예약 환불 규정은 네이버와 상이할수있습니다.
              </span>
            </li>
          </ul>
        </div>

        <div className="my-[1.5rem]/[3.75rem] flex flex-col items-center justify-center gap-4 border-t border-t-[#e5e5e5] bg-white p-4 lg:pt-20">
          <div className="flex items-center gap-x-[0.63rem]">
            <Checkbox
              id="agreement"
              className="rounded-none border-siteTextGray"
              checked={agreement}
              onCheckedChange={(checked) => setAgreement(checked as boolean)}
            />
            <label htmlFor="agreement" className="~text-xs/base">
              예약과 관련된 모든 주의사항 및{" "}
              <button
                type="button"
                onClick={() => openConditionsDialog()}
                className="underline underline-offset-2"
              >
                약관
              </button>
              에 동의합니다
            </label>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white py-8 lg:pb-[6.25rem]">
          <Button
            variant="ringHover"
            type="button"
            disabled={!agreement}
            className="py-[0.1875rem]/[0.4375rem] flex !w-fit bg-[#998465] ~text-base/[1.25rem] ~px-[0.75rem]/[1.6875rem]"
            onClick={() => {
              setShowPrecautions(false);
              window.scrollTo(0, 0);
            }}
          >
            예약 계속 진행 하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrecautionsContent;
