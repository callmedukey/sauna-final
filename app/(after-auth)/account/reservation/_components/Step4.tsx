"use client";

import { RoomType } from "@prisma/client";
import { isWeekend } from "date-fns";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { SpecialDate } from "@prisma/client";
import { calculateAdditionalFee } from "@/lib/timeUtils";

import { submitReservation } from "@/actions/submit";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  selectedRoom: {
    name: string;
    price: number;
    type: string;
    extra: string;
    last: string;
  };
  persons: {
    men: number;
    women: number;
    children: number;
    infants: number;
  };
  selectedDate: string;
  handleMessage: (message: string) => void;
  usedPoint: number;
  maxPoint: number;
  selectedTime: string;
  currentMessage: string;
  handleUsedPoint: (point: number) => void;
  specialDates: SpecialDate[];
}

export default function Step4({
  selectedRoom,
  persons,
  selectedDate,
  handleMessage,
  usedPoint,
  maxPoint,
  selectedTime,
  currentMessage,
  handleUsedPoint,
  specialDates,
}: Props) {
  const [agreement, setAgreement] = useState(false);
  const router = useRouter();

  // Calculate all prices
  const basePrice = selectedRoom.price;
  const additionalFee = calculateAdditionalFee(
    persons,
    selectedRoom.type.includes("FAMILY")
  );
  const subtotal = basePrice + additionalFee;

  const specialDate = specialDates.find(
    (sd) => sd.date === selectedDate.replace(/\//g, "-")
  );

  const discountAmount =
    specialDate?.type === "DISCOUNT" && specialDate.discount
      ? Math.floor(subtotal * (specialDate.discount / 100))
      : 0;

  const finalPrice = subtotal - discountAmount - usedPoint;

  // Debug logs
  console.log("Price calculations:", {
    basePrice,
    additionalFee,
    subtotal,
    specialDate,
    discountAmount,
    usedPoint,
    finalPrice,
  });

  const handlePayment = async () => {
    if (!agreement) {
      alert("예약과 관련된 모든 주의사항 및 약관에 동의해주세요.");
      return;
    }

    // Debug log before submission
    console.log("Submitting reservation with prices:", {
      price: subtotal,
      paidPrice: finalPrice,
      discount: specialDate?.discount,
      usedPoint,
    });

    const result = await submitReservation({
      date: selectedDate,
      time: selectedTime,
      roomType: selectedRoom.type as RoomType,
      men: persons.men,
      women: persons.women,
      children: persons.children,
      infants: persons.infants,
      message: currentMessage,
      usedPoint,
      price: subtotal,
      paidPrice: finalPrice,
      isWeekend: isWeekend(new Date(selectedDate)),
    });

    if (result.success) {
      alert("예약이 완료되었습니다.");
      router.push("/account/history");
    } else {
      alert(result.message);
    }
  };

  return (
    <motion.div
      className="border-t-2 border-siteBlack py-[3.12rem]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="step-title ~mb-[1.25rem]/[3.125rem]">
        <span>step 4</span>
        <span className="font-bold">예약 확인</span>
      </h2>
      <article className="mt-8 flex flex-col flex-wrap gap-x-[2.44rem] border border-siteBlack ~px-[2.81rem]/[2rem] ~py-[1.25rem]/[3.75rem] sm:mt-0 md:flex-row">
        <div className="grid shrink grow basis-[21rem] ~gap-x-[1.25rem]/[1.75rem]">
          <div className="flex flex-col ~gap-y-[0.63rem]/[1.25rem]">
            <span className="~text-base/[1.25rem]">룸 선택</span>
            <div className="flex ~text-xs/base ~gap-x-[1.25rem]/[1.75rem]">
              <span className="~text-xs/base sm:font-bold">
                {selectedRoom.name.includes("혼합")
                  ? "혼합룸[100분]"
                  : selectedRoom.name}
              </span>
              <div className="grid grid-cols-[repeat(2,auto)] ~gap-x-[1.25rem]/[1.75rem]">
                {Object.entries(persons)
                  .filter(([, value]) => value > 0)
                  .map(([key, value]) => {
                    if (key === "women") {
                      return <div key={key}>성인 여성 {value}인</div>;
                    }
                    if (key === "men") {
                      return <div key={key}>성인 남성 {value}인</div>;
                    }
                    if (key === "children") {
                      return <div key={key}>어린이 {value}인</div>;
                    }
                    if (key === "infants") {
                      return <div key={key}>유아 {value}인</div>;
                    }
                    return null;
                  })}
              </div>
            </div>
          </div>

          <hr className="col-span-full w-full border-siteOddGray ~my-[0.94rem]/[2.5rem]" />
          <div className="w-full space-y-[0.63rem]">
            <div className="~text-base/[1.25rem]">추가 요청</div>
            <p className="text-[0.75rem] text-siteOddGray">
              요청하신 내용은 솔로 사우나 레포 사정에 따라 반영되지 않을 수
              있으며, 별도 요금이 발생할 수 있으니 참고하시기 바랍니다.
            </p>
            <textarea
              name="message"
              id="message"
              className="h-40 w-full resize-none appearance-none border border-siteOddGray px-[0.56rem] py-[0.94rem] text-[0.75rem]"
              placeholder="추가 요청을 작성해 주세요"
              rows={6}
              onChange={(e) => handleMessage(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="shrink-0 grow bg-siteBgGray ~px-[0.56rem]/[1.19rem] ~py-[1.25rem]/[1.63rem]">
          <div>기본 요금</div>
          <ul className="mt-5 list-disc ~pl-2/6">
            <li>
              <div className="flex w-full">
                <span className="flex-1">
                  {selectedDate
                    .split("/")
                    .map((part, i) => {
                      const num = parseInt(part, 10);
                      if (i === 0) return `${num}년 `;
                      if (i === 1) return `${num}월 `;
                      return `${num}일`;
                    })
                    .join("")}
                </span>
                <span>{basePrice.toLocaleString()}원</span>
              </div>
            </li>
          </ul>

          <div className="~mt-[1.25rem]/[2.8rem]">
            <div className="flex w-full justify-between">
              <span>추가 요금</span>
              <span>{additionalFee.toLocaleString()}원</span>
            </div>
            {specialDate?.type === "DISCOUNT" && (
              <div className="flex w-full justify-between text-sm text-siteTextGray mt-2">
                <span>{specialDate.discount}% 할인</span>
                <span>-{discountAmount.toLocaleString()}원</span>
              </div>
            )}
          </div>

          <hr className="col-span-full w-full border-siteOddGray ~my-[0.94rem]/[2.5rem]" />

          <div className="flex">
            <div className="flex flex-col">
              <div>포인트 사용</div>
              <div>보유 포인트 {maxPoint ?? 0}P</div>
            </div>
            <input
              type="number"
              value={usedPoint || ""}
              min={0}
              max={maxPoint}
              onBlur={(e) => {
                if (!e.target.value) {
                  handleUsedPoint(0);
                } else if (isNaN(parseInt(e.target.value))) {
                  handleUsedPoint(0);
                } else if (parseInt(e.target.value) > maxPoint) {
                  handleUsedPoint(maxPoint);
                } else {
                  handleUsedPoint(parseInt(e.target.value));
                }
              }}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? 0 : parseInt(e.target.value);
                if (isNaN(value) || value < 0) {
                  handleUsedPoint(0);
                } else if (value > maxPoint) {
                  handleUsedPoint(maxPoint);
                } else {
                  handleUsedPoint(value);
                }
              }}
              className="ml-auto mr-0 h-8 w-20 border border-siteBlack bg-white px-2 sm:w-24"
            />
          </div>

          <div className="flex items-center ~mt-[1.88rem]/[3.69rem]">
            <div className="flex-1 font-bold ~text-base/[1.25rem]">총 요금</div>
            <div className="font-bold ~text-[0.75rem]/base">
              {discountAmount > 0 && (
                <span className="mr-2 text-gray-500 line-through">
                  {subtotal.toLocaleString()}원
                </span>
              )}
              <span>{finalPrice.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </article>
      <div className="mx-[-2.81rem] flex w-[calc(100%+5.62rem)] items-center justify-center gap-x-[0.63rem] text-nowrap ~mt-[1.25rem]/[6.25rem] ~mb-[1.25rem]/[3.12rem]">
        <Checkbox
          id="agreement"
          className="rounded-none border-siteTextGray"
          checked={agreement}
          onCheckedChange={(checked) => setAgreement(checked as boolean)}
        />
        <label htmlFor="agreement" className="~text-xs/base">
          예약과 관련된 모든{" "}
          <span className="underline underline-offset-2">주의사항</span> 및{" "}
          <span className="underline underline-offset-2">약관</span>에
          동의합니다
        </label>
      </div>
      <Button
        variant="ringHover"
        type="button"
        disabled={!agreement || !selectedTime || !selectedDate}
        className="py-[0.1875rem]/[0.4375rem] mx-auto flex !w-fit bg-golden ~text-base/[1.25rem] ~px-[0.75rem]/[1.6875rem]"
        onClick={handlePayment}
      >
        결제하기
      </Button>
    </motion.div>
  );
}
