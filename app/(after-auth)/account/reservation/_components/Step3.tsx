"use client";
import type { Reservation } from "@prisma/client";
import { format, isWeekend } from "date-fns";
import { ko } from "date-fns/locale";
import { Clock } from "lucide-react";
import { motion } from "motion/react";
import React, { useMemo } from "react";

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
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setDate(date);
    handleDate(format(date, "yyyy/MM/dd"));
    handleTime("");
  };

  const handleSelectTime = (time: string) => {
    handleTime(time);
  };

  const isTimeSlotAvailable = (timeSlot: { startingTime: string }) => {
    if (!date || !selectedRoom.type) return false;

    const [hours, minutes] = timeSlot.startingTime.split(":").map(Number);
    const slotStartTime = hours * 60 + minutes;
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
        // If there's a family room reservation, no other rooms can be booked
        if (reservation.roomType.includes("FAMILY")) return false;

        // If requesting family room and there's any existing reservation
        if (selectedRoom.type.includes("FAMILY")) return false;

        // If there's a men's room reservation, only women's room can be booked
        if (
          reservation.roomType.includes("MEN") &&
          !selectedRoom.type.includes("WOMEN")
        ) {
          return false;
        }

        // If there's a women's room reservation, only men's room can be booked
        if (
          reservation.roomType.includes("WOMEN") &&
          !selectedRoom.type.includes("MEN")
        ) {
          return false;
        }

        // Direct time slot conflict for same room type
        if (reservation.roomType === selectedRoom.type) return false;
      }
    }

    return true;
  };

  const availableTimes = useMemo(() => {
    if (!date) return [];
    if (!selectedRoom.type) return [];

    const fullListOfRooms = isWeekend(date as Date)
      ? Rooms[
          WeekendRooms[
            selectedRoom.type as keyof typeof WeekendRooms
          ] as keyof typeof Rooms
        ]
      : Rooms[selectedRoom.type as keyof typeof Rooms];

    return fullListOfRooms;
  }, [date, selectedRoom.type]);

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
          className="mx-auto mt-5 rounded-md border sm:mx-[revert] sm:mt-0"
          locale={ko}
        />
        <div className="mt-5 flex shrink flex-col ~gap-y-[1.25rem]/[1.69rem] sm:mt-0">
          <div className="text-base">방문 시간 선택</div>
          <div className="grid grid-cols-3 ~gap-x-[1.87rem]/[2.5rem] ~gap-y-[1.25rem]/[0.63rem]">
            {availableTimes.map((time) => (
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
