"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import IconClock from '@/public/icon-clock.png'
import IconDont from '@/public/icon-dont.png'
import IconExclamation from '@/public/icon-exclamation.png'
import IconGas from '@/public/icon-gas.png'
import IconMenu from '@/public/icon-menu.png'

import { useDialog } from "./Providers";
import { useWarning } from "./WarningProvider";

const WarningDialog = () => {
  const { warningOpen, setWarningOpen } = useWarning();
  const { openConditionsDialog } = useDialog();
  const [agreement, setAgreement] = useState(false);

  return (
    <Dialog open={warningOpen} onOpenChange={setWarningOpen}>
      <DialogContent className="max-h-[min(80vh,60rem)] max-w-[90%] 
      overflow-y-auto rounded-lg ~px-4/8 2xl:max-w-screen-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only w-full text-center text-2xl font-bold">
            주의사항
          </DialogTitle>
          <DialogDescription className="sr-only">
            주의사항 내용
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4 text-pretty break-keep border bg-[#e5e5e5] text-center ~p-[1.5rem]/[3.75rem]">
          <h1 className="font-bold text-[#b10000] ~text-[1rem]/[1.5rem]">사우나 이용 시 주의사항</h1>
          <p className="font-medium ~text-base/lg">만 18세 미만은 본 사우나를 이용할수 없으며, 초등학생 이상의 자녀는 같은 성별의 부모와 동반하여 그룹룸을 이용할 수 있습니다.
의사가 입욕을 금지한 경우, 아래의 나열된 건강 상태 중 하나라도 해당되는 경우와 컨디션이 좋지 않은 경 우에는 사우나 이용을 삼가해 주시기 바랍니다.
입실 전 음주측정을 하여, 음주 시에는 건강상의 이유로 본 시설을 이용할수 없습니다.</p>
          <p className="font-medium text-[#B10000] ~text-base/lg"> ※ 예약시간 5분 전에 도착해 주시기 바랍니다.</p>
        </div>

        <div className="">
          <div className="border-y border-y-[#999999] p-4 ~mt-[1.5rem]/[3.75rem]">
            <div className="flex flex-col gap-4  bg-white p-4 xl:flex xl:flex-row">
              <div className="flex items-start gap-2 py-7 ~text-[1rem]/lg">
                <Image src={IconExclamation} alt="Warning icon" width={24} height={24} />
                <h2 className="xl:min-w-60">사우나를 이용할 수 없는 건강 상태</h2>
              </div>
              <ul className="ml-8 space-y-2 font-medium ~text-[1rem]/lg xl:py-7">
                <li>- 수축기 혈압이 180mmhg 이상인 상태</li>
                <li>- 백내장이 우려되거나 안면부종증이 있는 상태</li>
                <li>- 급성질환(발열이 있는 경우), 심부전, 호흡성 질환, 파킨슨병, 심한 빈혈, 임신 또는 임신 가능성이 있는 경우</li>
                <li>- 전염성 질병, 폐결핵, 악성종양, 중증 심장병, 호흡부전, 급수부전</li>
                <li>- 최근에 수술을 받은 이력이 있는 경우</li>
                <li>- 출혈 또는 출혈으로 인한 출혈이 있는 경우</li>
                <li className="text-[#B10000]">※ 위와 같은 경우 입장이 제한 되는 점 양해 부탁드립니다 ※</li>
              </ul>
            </div>

            {/* Restricted section */}
            <div className="flex flex-col gap-4 border-y  border-y-[#e5e5e5] bg-white p-4 xl:flex-row ">
              <div className="flex items-start gap-2 py-7 ~text-[1rem]/lg">
                <Image src={IconDont} alt="Restricted icon" width={24} height={24} />
                <h2 className="xl:min-w-60">사우나를 중단하여야 하는 경우</h2>
              </div>
              <ul className="ml-8 space-y-2 font-medium ~text-[1rem]/lg xl:py-7">
                <li>- 열균형이 급히 깨배었던 경우</li>
                <li>- 입술이 감자기 자주빛으로 변한 경우</li>
                <li>- 심장에 이상을 느끼을 경우</li>
                <li>- 감각기 상한 두통을 느끼을 경우</li>
                <li>- 발작 이상감각(둔통)을 느끼을 경우</li>
              </ul>
            </div>

            {/* Additional notes */}
            <div className="flex flex-col gap-4 border-b  border-b-[#e5e5e5] bg-white p-4 xl:flex-row ">
              <div className="flex items-start gap-2 ~text-[1rem]/lg xl:py-7">
                <Image src={IconExclamation} alt="Notes icon" width={24} height={24} />
                <h2 className=" xl:min-w-60">주가 확인사항</h2>
              </div>
              <ul className="ml-8 space-y-2 font-medium ~text-[1rem]/lg xl:py-7 ">
                <li className="flex gap-2"> <span className="text-center">-</span> <span className="text-start">고혈압, 생활습관 관련 질환(당뇨병, 심장병, 뇌졸증, 만성질환)이 있는 고객께서는<br/>
                장시간 사우나 이용 또는 냉수 샤워를 삼가해 주시기 바랍니다.</span></li>     
                <li className="flex gap-2"> <span className="items-center">-</span> <span  >안경, 악세사리(목걸이, 귀걸이, 반지, 팔찌, 발찌, 그 외에 금속 장신구)를 착용 후 사우나를 즐기실 경우 화상을 입거나 악세사리 변형, 변색이 될 수 있으므로 준비해둔 귀중품 트레이에 보관해 주시길 바랍니다</span></li></ul>
            </div>

            {/* Fire safety */}
            <div className="flex flex-col gap-4  border-b border-b-[#e5e5e5] bg-white p-4 xl:flex-row ">
              <div className="flex items-start gap-2 ~text-[1rem]/lg xl:py-7">
                <Image src={IconGas} alt="Fire safety icon" width={24} height={24} />
                <h2 className=" xl:min-w-60">룸 유형 안내</h2>
              </div>
              <p className="ml-8 space-y-2 font-medium ~text-[1rem]/lg xl:py-7">- 성별 및 인원수에 맞는 룸 유형을 선택가능 합니다.</p>
            </div>

            {/* Reservation time */}
            <div className="flex flex-col gap-4 border-b border-b-[#e5e5e5] bg-white p-4 xl:flex-row ">
              <div className="flex items-center gap-2 ~text-[1rem]/lg xl:py-7">
                <Image src={IconClock} alt="Time icon" width={24} height={24} />
                <h2 className="xl:min-w-60">예약 관련 사항</h2>
              </div>
              <p className="ml-8 space-y-2 font-medium ~text-[1rem]/lg xl:py-7">- 원하시는 예약 시간대에 맞 조건이 없을 시 전화 주시면 조정 가능 합니다.</p>
            </div>

            {/* Cancellation policy */}
            <div className="flex flex-col gap-4  bg-white p-4 xl:flex-row ">
              <div className="flex items-start gap-2 ~text-[1rem]/lg xl:py-7">
                <Image src={IconMenu} alt="Cancellation ic  on" width={24} height={24} />
                <h2 className="xl:min-w-60">예약/변경/환불/취소 시<br/> 주의할 점</h2>
              </div>
              <ul className="ml-8 space-y-2 font-medium ~text-[1rem]/lg xl:py-7">
                <li>- 예약은 회원/비회원 둘 다 이용 가능하나, 비회원의 경우 포인트 적립 및 조회이 불가합니다.</li>
                <li>- 예약일 기준 2일 전 취소 시 취소 수수료 30% 부과.</li>
                <li>- 예약일 기준 1일 전 취소 시 취소 수수료 50% 부과.</li>
                <li>- 예약일 기준 당일 취소 시 취소 수수료 100% 부과.</li>
                <li>- 자체 예약 변경이 불가능 하니, 전화 주시면 예약 변경 가능 합니다.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mx-[-2.81rem] flex w-[calc(100%+5.62rem)] flex-col items-center justify-center gap-x-[0.63rem] text-nowrap ~mt-[1.25rem]/[6.25rem] ~mb-[1.25rem]/[3.12rem]">
          <div className="flex items-center gap-x-[0.63rem]">
            <Checkbox
              id="agreement"
              className="rounded-none border-siteTextGray"
              checked={agreement}
              onCheckedChange={(checked) => setAgreement(checked as boolean)}
            />
            <label htmlFor="agreement" className="~text-xs/base">
              예약과 관련된 모든 주의사항및{" "}
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
          <Button
            variant="ringHover"
            type="button"
            disabled={!agreement}
            className="py-[0.1875rem]/[0.4375rem] mt-[3.125rem] flex !w-fit bg-[#998465] ~text-base/[1.25rem] ~px-[0.75rem]/[1.6875rem]"
            onClick={() => setWarningOpen(false)}
          >
            예약 개속 진행 하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WarningDialog;
