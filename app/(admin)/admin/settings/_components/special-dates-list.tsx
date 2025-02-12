"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { deleteSpecialDate, getSpecialDates } from "../_actions";

interface SpecialDate {
  id: string;
  date: string;
  type: "BLOCKED" | "DISCOUNT";
  discount: number | null;
}

export default function SpecialDatesList({
  updateTrigger,
}: {
  updateTrigger?: number;
}) {
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);

  useEffect(() => {
    loadSpecialDates();
  }, [updateTrigger]);

  const loadSpecialDates = async () => {
    const dates = await getSpecialDates();
    setSpecialDates(dates);
  };

  const handleDelete = async (
    id: string,
    date: string,
    type: "BLOCKED" | "DISCOUNT",
    discount?: number | null
  ) => {
    const message =
      type === "BLOCKED"
        ? `${date} 날짜의 예약 불가 설정을 삭제하시겠습니까?`
        : `${date} 날짜의 ${discount}% 할인 설정을 삭제하시겠습니까?`;

    if (confirm(message)) {
      try {
        await deleteSpecialDate(id);
        await loadSpecialDates();
        alert("특별 날짜가 삭제되었습니다");
      } catch (error) {
        console.error(error);
        alert("특별 날짜 삭제에 실패했습니다");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-semibold">예약 불가 날짜 현황</h2>
        <div className="space-y-2">
          {specialDates
            .filter((date) => date.type === "BLOCKED")
            .map((date) => (
              <div
                key={date.id}
                className="flex items-center justify-between rounded border p-2"
              >
                <span>{date.date}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(date.id, date.date, date.type)}
                >
                  삭제
                </Button>
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-semibold">할인 날짜 현황</h2>
        <div className="space-y-2">
          {specialDates
            .filter((date) => date.type === "DISCOUNT")
            .map((date) => (
              <div
                key={date.id}
                className="flex items-center justify-between rounded border p-2"
              >
                <span>
                  {date.date} - {date.discount}% 할인
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    handleDelete(date.id, date.date, date.type, date.discount)
                  }
                >
                  삭제
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
