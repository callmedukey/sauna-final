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
import { checkTimeOverlap, getRoomDuration } from "@/lib/timeUtils";
import { cn } from "@/lib/utils";

const KOREAN_TIMEZONE = "Asia/Seoul";
const DEBUG_DATE = "2025/02/20"; // Changed to match stored format

// Utility function to normalize date format
const normalizeDateFormat = (date: string | Date) => {
  if (date instanceof Date) {
    const result = format(date, "yyyy-MM-dd");
    const shouldLog = result === DEBUG_DATE;
    if (shouldLog) {
      console.log("Normalizing Date object:", {
        original: date.toISOString(),
        normalized: result,
      });
    }
    return result;
  }
  // Convert both yyyy/MM/dd and yyyy-MM-dd to yyyy-MM-dd
  const result = date.replace(/\//g, "-");
  const shouldLog = result === DEBUG_DATE;
  if (shouldLog) {
    console.log("Normalizing string date:", {
      original: date,
      normalized: result,
    });
  }
  return result;
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
  console.log("Current reservations:", reservations);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    // Format as yyyy/MM/dd to match database format
    const formattedDate = format(date, "yyyy/MM/dd");
    const shouldLog = formattedDate === DEBUG_DATE;

    if (shouldLog) {
      console.log("Selected date:", formattedDate);
    }
    setDate(date);
    handleDate(formattedDate);
    handleTime("");
  };

  const isDateDisabled = (date: Date) => {
    // Format as yyyy/MM/dd to match database format
    const dateStr = format(date, "yyyy/MM/dd");
    const shouldLog = dateStr === DEBUG_DATE;

    // Get current Korea time
    const now = toZonedTime(new Date(), KOREAN_TIMEZONE);
    const todayStr = format(now, "yyyy/MM/dd");

    if (shouldLog) {
      console.log("Checking if date is disabled:", {
        dateToCheck: dateStr,
        today: todayStr,
      });
    }

    // Past date check
    if (dateStr < todayStr) {
      if (shouldLog) console.log("Date is in the past");
      return true;
    }

    // Future date check (6 months)
    const sixMonthsLater = new Date(now);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    const maxDate = format(sixMonthsLater, "yyyy/MM/dd");

    if (dateStr > maxDate) {
      if (shouldLog) console.log("Date is more than 6 months in future");
      return true;
    }

    // Check for blocked dates
    const specialDate = specialDates.find((sd) => sd.date === dateStr);
    if (shouldLog) {
      console.log("Special date check:", {
        specialDate: specialDate || "none",
      });
    }

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
    const dateStr = format(date, "yyyy/MM/dd");
    const shouldLog = dateStr === DEBUG_DATE;

    // Get current Korea time
    const now = toZonedTime(new Date(), KOREAN_TIMEZONE);
    const todayStr = format(now, "yyyy/MM/dd");
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const [selectedHour, selectedMinute] = time.split(":").map(Number);

    if (shouldLog) {
      console.log("Time selection check:", {
        selectedDate: dateStr,
        selectedTime: time,
        today: todayStr,
        currentTime: `${currentHour}:${currentMinute}`,
      });
    }

    // If same day, check if time is in the past
    if (dateStr === todayStr) {
      const selectedTotalMinutes = selectedHour * 60 + selectedMinute;
      const currentTotalMinutes = currentHour * 60 + currentMinute;

      if (selectedTotalMinutes <= currentTotalMinutes) {
        if (shouldLog) console.log("Selected time is in the past");
        alert("지난 시간은 선택할 수 없습니다.");
        return;
      }
    }

    handleTime(time);
  };

  const isTimeSlotAvailable = (timeSlot: { startingTime: string }) => {
    if (!date || !selectedRoom.type) return false;

    const dateStr = format(date, "yyyy/MM/dd");
    const shouldLog =
      dateStr === DEBUG_DATE && timeSlot.startingTime === "09:00";

    if (shouldLog) {
      console.log("Checking time slot availability:", {
        date: dateStr,
        time: timeSlot.startingTime,
        existingReservations: reservations,
      });
    }

    // Get current Korea time for same-day checks
    const now = toZonedTime(new Date(), KOREAN_TIMEZONE);
    const todayStr = format(now, "yyyy/MM/dd");

    // If same day, check if slot is at least 1 hour in future
    if (dateStr === todayStr) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const [slotHour, slotMinute] = timeSlot.startingTime
        .split(":")
        .map(Number);

      const currentTotalMinutes = currentHour * 60 + currentMinute;
      const slotTotalMinutes = slotHour * 60 + slotMinute;

      if (shouldLog) {
        console.log("Same day time check:", {
          currentTime: `${currentHour}:${currentMinute}`,
          slotTime: timeSlot.startingTime,
          minutesUntilSlot: slotTotalMinutes - currentTotalMinutes,
        });
      }

      if (slotTotalMinutes - currentTotalMinutes < 60) {
        if (shouldLog) console.log("Slot is less than 1 hour away");
        return false;
      }
    }

    // Check for overlapping reservations
    const conflictingReservation = reservations.find((reservation) => {
      if (reservation.date !== dateStr) return false;

      const [resHour, resMinute] = reservation.time.split(":").map(Number);
      const [slotHour, slotMinute] = timeSlot.startingTime
        .split(":")
        .map(Number);

      const resStartMinutes = resHour * 60 + resMinute;
      const slotStartMinutes = slotHour * 60 + slotMinute;

      const resDuration = getRoomDuration(reservation.roomType);
      const slotDuration = getRoomDuration(selectedRoom.type);

      const hasOverlap = checkTimeOverlap(
        slotStartMinutes,
        slotDuration,
        resStartMinutes,
        resDuration
      );

      if (shouldLog && hasOverlap) {
        console.log("Found overlapping reservation:", {
          reservationTime: reservation.time,
          reservationType: reservation.roomType,
          selectedTime: timeSlot.startingTime,
          selectedType: selectedRoom.type,
        });
      }

      return hasOverlap;
    });

    if (conflictingReservation) {
      // Apply room type rules
      if (
        conflictingReservation.roomType.includes("MIX") ||
        selectedRoom.type.includes("MIX")
      ) {
        return false;
      }

      // Women's room restrictions
      if (
        selectedRoom.type.includes("WOMEN") &&
        !selectedRoom.type.includes("FAMILY")
      ) {
        if (
          conflictingReservation.roomType.includes("MIX") ||
          conflictingReservation.roomType.includes("WOMEN_FAMILY")
        ) {
          return false;
        }
      }

      // Men's room restrictions
      if (
        selectedRoom.type.includes("MEN") &&
        !selectedRoom.type.includes("FAMILY")
      ) {
        if (
          conflictingReservation.roomType.includes("MIX") ||
          conflictingReservation.roomType.includes("MEN_FAMILY")
        ) {
          return false;
        }
      }

      // Allow overlap for Men's and Women's 60/90 rooms
      if (
        (selectedRoom.type.includes("WOMEN") &&
          conflictingReservation.roomType.includes("MEN")) ||
        (selectedRoom.type.includes("MEN") &&
          conflictingReservation.roomType.includes("WOMEN"))
      ) {
        if (
          !selectedRoom.type.includes("FAMILY") &&
          !conflictingReservation.roomType.includes("FAMILY")
        ) {
          return true;
        }
      }

      return false;
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
