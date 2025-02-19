"use client";
import type { Reservation, SpecialDate } from "@prisma/client";
import { format, isWeekend, isBefore, isAfter } from "date-fns";
import { ko } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import { Clock } from "lucide-react";
import { motion } from "motion/react";
import React, { useMemo, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Rooms, WeekendRooms } from "@/definitions/constants";
import { getRoomDuration } from "@/lib/timeUtils";
import { cn } from "@/lib/utils";

const KOREAN_TIMEZONE = "Asia/Seoul";

// Add TimeSlot type
type TimeSlot = {
  startingTime: string;
  endingTime: string;
};

// Utility function to normalize date format
const normalizeDateFormat = (date: string | Date) => {
  if (date instanceof Date) {
    return format(date, "yyyy-MM-dd");
  }
  // Convert both yyyy/MM/dd and yyyy-MM-dd to yyyy-MM-dd
  return date.replace(/\//g, "-");
};

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
    // Store date in yyyy-MM-dd format
    handleDate(format(date, "yyyy-MM-dd"));
    handleTime("");
  };

  const isDateDisabled = (date: Date) => {
    // Convert to Korean timezone for consistent comparison
    const koreaDate = toZonedTime(date, KOREAN_TIMEZONE);
    const koreaToday = toZonedTime(new Date(), KOREAN_TIMEZONE);

    // Reset hours to ensure date-only comparison
    koreaToday.setHours(0, 0, 0, 0);

    // Check if date is more than 6 months in the future
    const sixMonthsFromNow = new Date(koreaToday);
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    if (
      isBefore(koreaDate, koreaToday) ||
      isAfter(koreaDate, sixMonthsFromNow)
    ) {
      return true;
    }

    // Then check if it's a blocked date
    const dateStr = format(koreaDate, "yyyy-MM-dd");
    const specialDate = specialDates.find(
      (sd) => normalizeDateFormat(sd.date) === dateStr
    );
    return specialDate?.type === "BLOCKED";
  };

  const renderDayContents = (day: number, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const specialDate = specialDates.find(
      (sd) => normalizeDateFormat(sd.date) === dateStr
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

    // Convert to Korean timezone for consistent comparison
    const now = toZonedTime(new Date(), KOREAN_TIMEZONE);
    const [hours, minutes] = time.split(":").map(Number);
    const selectedDateTime = toZonedTime(date, KOREAN_TIMEZONE);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    if (
      normalizeDateFormat(date) === normalizeDateFormat(now) &&
      isBefore(selectedDateTime, now)
    ) {
      alert("지난 시간은 선택할 수 없습니다.");
      return;
    }

    handleTime(time);
  };

  const isTimeSlotAvailable = (timeSlot: TimeSlot) => {
    if (!date) return false;

    // Parse selected time slot
    const [startHours, startMinutes] = timeSlot.startingTime
      .split(":")
      .map(Number);
    const selectedStart = new Date(date);
    selectedStart.setHours(startHours, startMinutes, 0, 0);

    // Calculate duration and cleaning time
    const duration = getRoomDuration(selectedRoom.type);
    const selectedEnd = new Date(
      selectedStart.getTime() + duration * 60 * 1000
    );
    const cleaningTime =
      selectedRoom.type.includes("FAMILY") || selectedRoom.type.includes("MIX")
        ? 40
        : 20;
    const selectedEndWithCleaning = new Date(
      selectedEnd.getTime() + cleaningTime * 60 * 1000
    );

    // Check 60-minute advance rule
    const now = new Date();
    if (selectedStart < new Date(now.getTime() + 60 * 60 * 1000)) {
      return false;
    }

    // Check against existing reservations
    return !reservations.some((reservation) => {
      const resDate = new Date(reservation.date);
      if (normalizeDateFormat(resDate) !== normalizeDateFormat(date))
        return false;

      // Parse reservation time
      const [resHours, resMinutes] = reservation.time.split(":").map(Number);
      const resStart = new Date(resDate);
      resStart.setHours(resHours, resMinutes, 0, 0);

      // Calculate reservation end with cleaning
      const resDuration = getRoomDuration(reservation.roomType);
      const resEnd = new Date(resStart.getTime() + resDuration * 60 * 1000);
      const resCleaning =
        reservation.roomType.includes("FAMILY") ||
        reservation.roomType.includes("MIX")
          ? 40
          : 20;
      const resEndWithCleaning = new Date(
        resEnd.getTime() + resCleaning * 60 * 1000
      );

      // Check time overlap
      const timeConflict =
        selectedStart < resEndWithCleaning &&
        selectedEndWithCleaning > resStart;
      if (!timeConflict) return false;

      // Check room type conflicts
      const isMixConflict =
        selectedRoom.type.includes("MIX") ||
        reservation.roomType.includes("MIX");
      const isSameGender =
        (selectedRoom.type.startsWith("WOMEN") &&
          reservation.roomType.startsWith("WOMEN")) ||
        (selectedRoom.type.startsWith("MEN") &&
          reservation.roomType.startsWith("MEN"));
      const isFamilyConflict =
        selectedRoom.type.includes("FAMILY") &&
        reservation.roomType.includes("FAMILY");

      return isMixConflict || isSameGender || isFamilyConflict;
    });
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

  return (
    <motion.div
      className="border-b-2 border-siteBlack py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="step-title ~mb-[1.25rem]/[3.125rem]">
        <span>step 3</span>
        <span className="font-bold">예약 일시 선택</span>
      </h2>
      <article className="mx-auto flex w-fit flex-col gap-x-[4.31rem] sm:w-full sm:flex-row md:gap-x-24 xl:gap-x-32">
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
          <div className="text-base">방문 시간 선택</div>
          <div className="grid grid-cols-3 ~gap-x-[1.87rem]/[2.5rem] ~gap-y-[1.25rem]/[0.63rem]">
            {availableTimes.map((time: TimeSlot) => (
              <button
                className={cn(
                  "flex items-center rounded-[0.3125rem] transition duration-100 min-h-[3.125rem] max-w-[5.5rem] basis-[4rem] border border-siteOddGray ~gap-[0.31rem]/[0.62rem] ~px-[0.56rem]/[0.7rem] ~py-[0.81]/[1rem]",
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
