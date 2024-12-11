"use client";
import type { Reservation, SpecialDate } from "@prisma/client";
import { format, isWeekend, isBefore } from "date-fns";
import { ko } from "date-fns/locale";
import { Clock } from "lucide-react";
import { motion } from "motion/react";
import React, { useMemo, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Rooms, WeekendRooms } from "@/definitions/constants";
import { checkTimeOverlap, getRoomDuration } from "@/lib/timeUtils";
import { cn } from "@/lib/utils";

const Step3 = ({
  handleTime,
  reservations,
  handleDate,
  selectedRoom,
  selectedTime,
  specialDates,
}: {
  reservations: Pick<Reservation, "date" | "time" | "id" | "roomType">[];
  handleTime: (time: string) => void;
  handleDate: (date: string) => void;
  selectedRoom: {
    type: string;
    price: number;
    extra: string;
    last: string;
    name: string;
  };
  selectedTime: string;
  specialDates: Pick<SpecialDate, "date" | "type" | "discount">[];
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setDate(date);
    handleDate(format(date, "yyyy/MM/dd"));
    handleTime("");
  };

  const isDateDisabled = (date: Date) => {
    // First check if it's a past date
    const koreaDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );
    const koreaToday = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );
    koreaToday.setHours(0, 0, 0, 0);

    if (isBefore(koreaDate, koreaToday)) {
      return true;
    }

    // Then check if it's a blocked date
    const dateStr = format(date, "yyyy-MM-dd");
    const specialDate = specialDates.find(
      (sd) => sd.date.replace(/\//g, "-") === dateStr
    );
    return specialDate?.type === "BLOCKED";
  };

  const renderDayContents = (day: number, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const specialDate = specialDates.find(
      (sd) => sd.date.replace(/\//g, "-") === dateStr
    );

    if (specialDate?.type === "BLOCKED") {
      return (
        <div className="relative flex flex-col items-center">
          <span>{day}</span>
          <span className="absolute top-[20px] whitespace-nowrap text-[10px] text-red-400">
            휴무
          </span>
        </div>
      );
    }

    return (
      <div className="relative flex flex-col items-center">
        <span>{day}</span>
        {specialDate?.type === "DISCOUNT" && (
          <span className="absolute top-[20px] whitespace-nowrap text-[10px] text-green-600">
            {specialDate.discount}%
          </span>
        )}
      </div>
    );
  };

  const handleSelectTime = (time: string) => {
    if (!date) return;

    // Check if the selected time is in the past for today's date
    const now = new Date();
    const koreaTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );
    const [hours, minutes] = time.split(":").map(Number);
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    if (
      format(date, "yyyy/MM/dd") === format(koreaTime, "yyyy/MM/dd") &&
      isBefore(selectedDateTime, koreaTime)
    ) {
      alert("지난 시간은 선택할 수 없습니다.");
      return;
    }

    handleTime(time);
  };

  const isTimeSlotAvailable = (timeSlot: { startingTime: string }) => {
    if (!date || !selectedRoom.type) return false;

    // Check if the time slot is in the past for today's date
    const now = new Date();
    const koreaTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );
    const [hours, minutes] = timeSlot.startingTime.split(":").map(Number);
    const slotDateTime = new Date(date);
    slotDateTime.setHours(hours, minutes, 0, 0);

    if (
      format(date, "yyyy/MM/dd") === format(koreaTime, "yyyy/MM/dd") &&
      isBefore(slotDateTime, koreaTime)
    ) {
      return false;
    }

    const [slotHours, slotMinutes] = timeSlot.startingTime
      .split(":")
      .map(Number);
    const slotStartTime = slotHours * 60 + slotMinutes;
    const slotDuration = getRoomDuration(selectedRoom.type);

    // Check against all existing reservations
    for (const reservation of reservations) {
      if (reservation.date !== format(date as Date, "yyyy/MM/dd")) continue;

      const [resHours, resMinutes] = reservation.time.split(":").map(Number);
      const resStartTime = resHours * 60 + resMinutes;
      const resDuration = getRoomDuration(reservation.roomType);

      const hasOverlap = checkTimeOverlap(
        slotStartTime,
        slotDuration,
        resStartTime,
        resDuration
      );

      if (hasOverlap) {
        // Rule 2: When 혼성룸 is selected or reserved, no other rooms allowed
        if (
          reservation.roomType.includes("MIX") ||
          selectedRoom.type.includes("MIX")
        ) {
          return false;
        }

        // Rule 1: 60/90 minute room restrictions
        if (reservation.roomType.includes("MEN")) {
          // If men's 60 is reserved, block men's 90 and vice versa
          if (
            reservation.roomType.includes("60") &&
            selectedRoom.type.includes("MEN")
          ) {
            return false;
          }
          // Block women's family and mix rooms when men's room is reserved
          if (
            selectedRoom.type.includes("WOMEN_FAMILY") ||
            selectedRoom.type.includes("MIX")
          ) {
            return false;
          }
        }

        if (reservation.roomType.includes("WOMEN")) {
          // If women's 60 is reserved, block women's 90 and vice versa
          if (
            reservation.roomType.includes("60") &&
            selectedRoom.type.includes("WOMEN")
          ) {
            return false;
          }
          // Block men's family and mix rooms when women's room is reserved
          if (
            selectedRoom.type.includes("MEN_FAMILY") ||
            selectedRoom.type.includes("MIX")
          ) {
            return false;
          }
        }

        // Rule 3: Family room exceptions
        if (reservation.roomType.includes("FAMILY")) {
          // Allow opposite sex 60/90 rooms with family rooms
          if (reservation.roomType.includes("MEN_FAMILY")) {
            return (
              selectedRoom.type.includes("WOMEN60") ||
              selectedRoom.type.includes("WOMEN90")
            );
          }
          if (reservation.roomType.includes("WOMEN_FAMILY")) {
            return (
              selectedRoom.type.includes("MEN60") ||
              selectedRoom.type.includes("MEN90")
            );
          }
        }

        // Block same room type
        if (reservation.roomType === selectedRoom.type) {
          return false;
        }
      }
    }

    return true;
  };

  const availableTimes = useMemo(() => {
    if (!date || !selectedRoom.type) return [];

    try {
      if (isWeekend(date)) {
        // Check if weekend room type exists
        const weekendType =
          WeekendRooms[selectedRoom.type as keyof typeof WeekendRooms];
        if (!weekendType) {
          console.error("Weekend room type not found:", selectedRoom.type);
          return [];
        }
        return Rooms[weekendType as keyof typeof Rooms] || [];
      }

      // Check if regular room type exists
      return Rooms[selectedRoom.type as keyof typeof Rooms] || [];
    } catch (error) {
      console.error("Error getting available times:", error);
      return [];
    }
  }, [date, selectedRoom.type]);

  // Add TimeSlot type
  type TimeSlot = {
    startingTime: string;
    endingTime: string;
  };

  return (
    <motion.div
      className="border-b-2 border-siteBlack py-[3.12rem]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="step-title ~mb-[1.25rem]/[3.125rem]">
        <span>step 3</span>
        <span className="font-bold">예약 일시 선택</span>
      </h2>
      <article className="mx-auto flex w-fit flex-col gap-x-[4.31rem] sm:w-full sm:flex-row">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelectDate}
          disabled={isDateDisabled}
          modifiers={{ disabled: isDateDisabled }}
          modifiersClassNames={{
            disabled: "text-gray-400 cursor-not-allowed",
          }}
          className="mx-auto mt-5 rounded-md border sm:mx-[revert] sm:mt-0"
          locale={ko}
          components={{
            DayContent: ({ date }) => {
              const day = date.getDate();
              return renderDayContents(day, date);
            },
          }}
        />
        <div className="mt-5 flex shrink flex-col ~gap-y-[1.25rem]/[1.69rem] sm:mt-0">
          <div className="text-base">문 시간 선택</div>
          <div className="grid grid-cols-3 ~gap-x-[1.87rem]/[2.5rem] ~gap-y-[1.25rem]/[0.63rem]">
            {availableTimes.map((time: TimeSlot) => (
              <button
                className={cn(
                  "flex items-center rounded-none transition duration-100 min-h-[3.125rem] max-w-[5.5rem] basis-[4rem] border border-siteOddGray ~gap-[0.31rem]/[0.62rem] ~px-[0.56rem]/[0.7rem] ~py-[0.81]/[1rem]",
                  time.startingTime === selectedTime &&
                    "bg-golden text-white border-golden",
                  !isTimeSlotAvailable(time) && "opacity-40 cursor-not-allowed"
                )}
                key={time.startingTime}
                disabled={!isTimeSlotAvailable(time)}
                onClick={() => handleSelectTime(time.startingTime)}
              >
                <Clock
                  className={cn(
                    "size-3 text-siteOddGray",
                    time.startingTime === selectedTime && "text-white"
                  )}
                />
                {time.startingTime}
              </button>
            ))}
          </div>
        </div>
      </article>
    </motion.div>
  );
};

export default Step3;
