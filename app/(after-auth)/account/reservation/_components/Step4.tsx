"use client";

import { RoomType } from "@prisma/client";
import type { SpecialDate } from "@prisma/client";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { isWeekend } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { split } from "postcss/lib/list";
import React, { useState, useEffect } from "react";

import { useDialog } from "@/components/layout/Providers";
import { useWarning } from "@/components/layout/WarningProvider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { storePendingReservation } from "@/lib/payment";

const KOREAN_TIMEZONE = "Asia/Seoul";

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
  specialDates: Pick<SpecialDate, "date" | "type" | "discount">[];
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
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const searchParams = useSearchParams();
  const { openConditionsDialog } = useDialog();
  const { setWarningOpen } = useWarning();

  // Check for payment errors
  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");
    if (error) {
      alert(message || "결제 처리 중 오류가 발생했습니다.");
    }
  }, [searchParams]);

  // Calculate all prices
  const basePrice = selectedRoom.price;
  const adultCount = persons.men + persons.women;
  const childCount = persons.children;
  const infantCount = persons.infants;

  // Get base included adult count based on room type
  // Family rooms (MEN_FAMILY, WOMEN_FAMILY) and MIX room include 2 adults in base price
  const isFamilyOrMixRoom =
    selectedRoom.type.includes("FAMILY") || selectedRoom.type.includes("MIX");
  const baseIncludedAdults = isFamilyOrMixRoom ? 2 : 1;

  // Only charge for adults beyond the base included count
  const additionalAdults = Math.max(0, adultCount - baseIncludedAdults);

  // Family rooms and MIX room charge 45,000 per additional adult
  // Regular rooms charge 35,000 per additional adult
  const adultFee = additionalAdults * (isFamilyOrMixRoom ? 45000 : 35000);

  // Children are charged 20,000 each, infants are free
  const childFee = childCount * 20000;

  const subtotal = basePrice + adultFee + childFee;

  const specialDate = specialDates.find(
    (sd) => sd.date === selectedDate.replace(/\//g, "-")
  );

  const discountAmount =
    specialDate?.type === "DISCOUNT" && specialDate.discount
      ? Math.floor(subtotal * (specialDate.discount / 100))
      : 0;

  const finalPrice = subtotal - discountAmount - usedPoint;

  const handlePayment = async () => {
    if (!agreement) {
      alert("예약과 관련된 모든 주의사항 및 약관에 동의해주세요.");
      return;
    }

    if (isPaymentProcessing) {
      return;
    }

    setIsPaymentProcessing(true);

    try {
      // Initialize TossPayments
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_ID;
      if (!clientKey) {
        console.error("Toss client key is not configured");
        alert("결제 설정이 올바르지 않습니다. 관리자에게 문의해주세요.");
        return;
      }

      const tossPayments = await loadTossPayments(clientKey);

      // Generate a unique order ID
      const orderId = `ORDER_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Convert date to Korean timezone for weekend check
      const dateInKorea = toZonedTime(
        new Date(selectedDate.replace(/\//g, "-")),
        KOREAN_TIMEZONE
      );
      const isWeekendDay = isWeekend(dateInKorea);

      // Determine the correct room type based on whether it's a weekend
      const roomType = isWeekendDay
        ? (`${selectedRoom.type}WEEKEND` as RoomType)
        : (selectedRoom.type as RoomType);

      // Store reservation details
      const reservationDetails = {
        date: selectedDate,
        time: selectedTime,
        roomType,
        men: persons.men,
        women: persons.women,
        children: persons.children,
        infants: persons.infants,
        message: currentMessage,
        usedPoint,
        price: subtotal,
        paidPrice: finalPrice,
        orderId,
        paymentKey: "", // Will be filled by Toss
        paymentStatus: "PENDING",
        isWeekend: isWeekendDay,
      };

      // Store reservation details before initiating payment
      try {
        await storePendingReservation(orderId, reservationDetails);
      } catch (storeError) {
        console.error("Failed to store reservation:", storeError);
        alert("예약 정보 저장에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      // Initialize payment
      const payment = tossPayments.payment({
        customerKey: orderId, // Using orderId as customerKey for simplicity
      });

      // Request payment
      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: finalPrice,
        },
        orderId,
        orderName: `${selectedRoom.name} - ${selectedDate} ${selectedTime}`,
        successUrl: `${window.location.origin}/api/payments/success`,
        failUrl: `${window.location.origin}/api/payments/fail`,
        customerEmail: "", // Optional: Add customer email if available
        customerName: "", // Optional: Add customer name if available
        card: {
          useEscrow: false,
          flowMode: "DEFAULT",
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        if (error.message.includes("clientKey")) {
          alert("결제 설정이 올바르지 않습니다. 관리자에게 문의해주세요.");
        } else {
          alert(`결제 중 오류가 발생했습니다: ${error.message}`);
        }
      } else {
        alert("알 수 없는 오류가 생했습니다. 다시 도해주세요.");
      }
    } finally {
      setIsPaymentProcessing(false);
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
              <span>기본 요금 (성인 {baseIncludedAdults}인 포함)</span>
              <span>{basePrice.toLocaleString()}원</span>
            </div>
            {adultFee > 0 && (
              <div className="flex w-full justify-between">
                <span>성인 추가 요금 ({additionalAdults}인)</span>
                <span>{adultFee.toLocaleString()}원</span>
              </div>
            )}
            {childFee > 0 && (
              <div className="flex w-full justify-between">
                <span>어린이 추가 요금 ({childCount}인)</span>
                <span>{childFee.toLocaleString()}원</span>
              </div>
            )}
            {infantCount > 0 && (
              <div className="flex w-full justify-between text-sm text-siteTextGray">
                <span>유아 ({infantCount}인)</span>
                <span>무료</span>
              </div>
            )}
            {specialDate?.type === "DISCOUNT" && (
              <div className="mt-2 flex w-full justify-between text-sm text-siteTextGray">
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
          <button
          type="button"
            onClick={() => setWarningOpen(true)}
            className="underline underline-offset-2"
          >
            주의사항
          </button>{" "}
          및{" "}
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
        disabled={
          !agreement || !selectedTime || !selectedDate || isPaymentProcessing
        }
        className="py-[0.1875rem]/[0.4375rem] mx-auto flex !w-fit bg-golden ~text-base/[1.25rem] ~px-[0.75rem]/[1.6875rem]"
        onClick={handlePayment}
      >
        {isPaymentProcessing ? "결제 처리 중..." : "결제하기"}
      </Button>
    </motion.div>
  );
}