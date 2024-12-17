"use client";
import { RoomType } from "@prisma/client";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { nanoid } from "nanoid";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

import { useDialog } from "@/components/layout/Providers";
import { useWarning } from "@/components/layout/WarningProvider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PointsOptions } from "@/definitions/constants";
import { storePendingReservation } from "@/lib/payment";
const PointCheckout = () => {
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const [isAgreement, setIsAgreement] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { openConditionsDialog } = useDialog();
  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");
    const message = searchParams.get("message");

    if (message) {
      if (success) {
        alert(decodeURIComponent(message));
      } else if (error) {
        alert(decodeURIComponent(message));
      }
    }
  }, [searchParams]);
  const { setWarningOpen } = useWarning();

  const handleValueChange = (value: string) => {
    setSelectedPoint(value);
  };

  const handlePayment = async () => {
    if (!isAgreement) {
      alert("이용 약관에 동의해주세요");
      return;
    }
    if (!selectedPoint) {
      alert("충전할 포인트 금액을 선택해주세요");
      return;
    }

    try {
      setIsLoading(true);
      const selectedOption = PointsOptions.find(
        option => (option.point + option.extraPoint).toString() === selectedPoint
      );

      if (!selectedOption) {
        throw new Error("Invalid point option selected");
      }
   

      const paymentAmount = selectedOption.point - selectedOption.extraPoint;
      const orderId = `POINT_${Date.now()}_${nanoid(10)}`;

      const paymentData = {
        amount: paymentAmount,
        points: selectedOption.point + selectedOption.extraPoint,
        orderId,
        type: "POINT",
        date: "",
        time: "",
        roomType: "MEN60" as RoomType,
        men: 0,
        women: 0,
        children: 0,
        infants: 0,
        message: "",
        price: paymentAmount,
        paidPrice: paymentAmount,
        usedPoint: 0,
        isWeekend: false,
        paymentKey: "",
        paymentStatus: "PENDING",
      };

      await storePendingReservation(orderId, paymentData);

      const tossPayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_ID!);

      await tossPayments.requestPayment("카드", {
        amount: paymentAmount,
        orderId,
        orderName: `포인트 충전 (${selectedOption.point + selectedOption.extraPoint}P)`,
        successUrl: `${window.location.origin}/api/points/success`,
        failUrl: `${window.location.origin}/account/points?error=PAYMENT_FAILED&message=${encodeURIComponent("결제가 취소되었습니다.")}`,
      });
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert("결제 초기화 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedOptionDetails = () => {
    if (!selectedPoint) return null;
    return PointsOptions.find(
      option => (option.point + option.extraPoint).toString() === selectedPoint
    );
  };

  const selectedOption = getSelectedOptionDetails();

  return (
    <div className="mx-auto w-full ~mt-[1rem]/[1.875rem]">
      <Select onValueChange={handleValueChange} value={selectedPoint}>
        <SelectTrigger className="mx-auto w-full justify-center gap-2 rounded-none border-none bg-siteBgGray ~text-xs/base ~py-[0.3125rem]/[0.5rem]">
          <SelectValue placeholder="충전할 포인트 금액을 선택해 주세요" />
        </SelectTrigger>
        <SelectContent>
          {PointsOptions.map((option) => (
            <SelectItem
              key={option.point}
              value={(option.point + option.extraPoint).toString()}
              className="px-1"
            >
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex-all-center gap-4 font-bold ~text-xs/base ~mt-[4.8125rem]/[8.75rem]">
        <span className="~text-base/[1.25rem]">총 요금</span>
        <span className="~text-xs/base">
          {selectedOption ? 
            (selectedOption.point - selectedOption.extraPoint).toLocaleString()
            : "0"}원
        </span>
      </div>
      <div className="flex-all-center gap-2 ~mt-[1.875rem]/[3rem]">
        <Checkbox
          id="point-agreement"
          className="rounded-none border-siteTextGray ~size-[0.75rem]/[1.25rem]"
          checked={isAgreement}
          onCheckedChange={(checked) => setIsAgreement(checked as boolean)}
        />
        <label htmlFor="point-agreement" className="~text-[0.5rem]/base">
          예약과 관련된 모든 
          <button
          type="button"
          onClick={() => setWarningOpen(true)}
          className="underline underline-offset-2"
          >주의사항
          </button>
           및 
           <button
           type="button"
           onClick={() => openConditionsDialog()}
           className="underline underline-offset-2"
           >약관</button>에 동의합니다
        </label>
      </div>
      <Button
        variant={"ringHover"}
        onClick={handlePayment}
        disabled={!isAgreement || !selectedPoint || isLoading}
        type="button"
        className="py-[0.1875rem]/[0.4375rem] mx-auto flex !w-fit bg-golden ~text-base/[1.25rem] ~mt-[1.875rem]/[3rem] ~px-[0.75rem]/[1.6875rem]"
      >
        {isLoading ? "처리 중..." : "결제 하기"}
      </Button>
    </div>
  );
};

export default PointCheckout;
