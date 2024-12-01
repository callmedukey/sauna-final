"use client";
import React, { useState } from "react";

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

const PointCheckout = () => {
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const [isAgreement, setIsAgreement] = useState<boolean>(false);

  const handleValueChange = (value: string) => {
    setSelectedPoint(value);
  };

  const handlePayment = () => {
    if (!isAgreement) {
      alert("이용 약관에 동의해주세요");
      return;
    }
    if (!selectedPoint) {
      alert("충전할 포인트 금액을 선택해주세요");
    }
  };

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
          {selectedPoint ? Number(selectedPoint).toLocaleString() : "0"}원
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
          예약과 관련된 모든 주의사항 및 약관에 동의합니다
        </label>
      </div>
      <Button
        variant={"ringHover"}
        onClick={handlePayment}
        disabled={!isAgreement || !selectedPoint}
        type="button"
        className="py-[0.1875rem]/[0.4375rem] mx-auto flex !w-fit bg-golden ~text-base/[1.25rem] ~mt-[1.875rem]/[3rem] ~px-[0.75rem]/[1.6875rem]"
      >
        결제 하기
      </Button>
    </div>
  );
};

export default PointCheckout;
