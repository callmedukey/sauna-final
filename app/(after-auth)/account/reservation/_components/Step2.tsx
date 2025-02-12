"use client";

import { motion } from "motion/react";
import React from "react";

import { RoomInfo } from "@/definitions/constants";
import { cn } from "@/lib/utils";

const Step2 = ({
  handleRoom,
  currentRoom,
  persons,
}: {
  handleRoom: (room: {
    name: string;
    price: number;
    type: string;
    extra: string;
    last: string;
  }) => void;
  currentRoom: {
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
}) => {
  const roomList = Object.values(RoomInfo).filter((room) => {
    const hasChildren = persons.children > 0 || persons.infants > 0;
    const totalAdults = persons.men + persons.women;
    const totalChildren = persons.children + persons.infants;

    // Filter out MIX rooms when only one gender is present
    if (
      room.type.includes("MIX") &&
      (persons.men === 0 || persons.women === 0)
    ) {
      return false;
    }

    // Helper function to check if room is a family room
    const isFamilyRoom =
      room.type === "MEN_FAMILY" || room.type === "WOMEN_FAMILY";

    // Get base max capacity based on room type
    const baseMaxCapacity = room.type.includes("MIX")
      ? 6
      : isFamilyRoom
      ? 4
      : 3;

    // For family rooms, one child/infant can count towards base capacity
    const childrenForBaseCapacity = isFamilyRoom && totalAdults === 1 ? 1 : 0;

    // Check if adults exceed base capacity - but allow family rooms for 2 or more adults
    if (
      totalAdults > baseMaxCapacity &&
      !(
        isFamilyRoom &&
        ((persons.men >= 2 && persons.women === 0) ||
          (persons.women >= 2 && persons.men === 0))
      )
    ) {
      return false;
    }

    // Calculate remaining capacity after base capacity is filled
    const remainingCapacity = baseMaxCapacity - totalAdults;
    const additionalChildrenCount = totalChildren - childrenForBaseCapacity;

    // If room is at max capacity, then limit additional children/infants to 2
    if (totalAdults === baseMaxCapacity && additionalChildrenCount > 2) {
      return false;
    }

    // If room is not at max capacity, check if additional children/infants fit
    if (additionalChildrenCount > remainingCapacity + 2) {
      return false;
    }

    // Now check room type compatibility
    if (persons.men > 0 && persons.women > 0) {
      // When both men and women are selected, show MIX room only
      return room.type.includes("MIX");
    }
    if (persons.men > 0 && persons.women === 0) {
      // Show men's rooms and men's family rooms for male groups
      return (
        room.type.includes("MEN") &&
        !room.type.includes("MIX") &&
        (room.type === "MEN60" ||
          room.type === "MEN90" ||
          (hasChildren && room.type === "MEN_FAMILY") ||
          (persons.men >= 2 && room.type === "MEN_FAMILY"))
      );
    }
    if (persons.men === 0 && persons.women > 0) {
      // Show women's rooms and women's family rooms for female groups
      return (
        room.type.includes("WOMEN") &&
        !room.type.includes("MIX") &&
        (room.type === "WOMEN60" ||
          room.type === "WOMEN90" ||
          (hasChildren && room.type === "WOMEN_FAMILY") ||
          (persons.women >= 2 && room.type === "WOMEN_FAMILY"))
      );
    }
    return false;
  });

  // Remove handleRoomLogic since we're doing capacity checks in the filter
  const handleRoomLogic = (room: {
    name: string;
    price: number;
    type: string;
    extra: string;
    last: string;
  }) => {
    handleRoom(room);
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
        <span>step 2</span>
        <span className="font-bold">룸 선택</span>
      </h2>
      {roomList.length === 0 ? (
        <div className="text-center text-base font-medium text-siteTextGray">
          선택하신 인원에 맞는 이용 가능한 룸이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 ~gap-[1.25rem]/[0.31rem] sm:grid-cols-3">
          {roomList.map((room) => (
            <button
              onClick={() => handleRoomLogic(room)}
              key={room.name}
              className={cn(
                "min-w-0 flex-none transition duration-300 rounded-[0.3125rem] basis-[17.5rem] w-[17.5rem] max-w-full ~py-[0.625rem]/[0.75rem] flex-all-center flex-col text-center ~text-xs/base border border-siteTextGray gap-y-[0.625rem] sm:gap-y-[revert]",
                room.name === "혼합룸+대형사우나룸[100분]" && "sm:hidden",
                room.name === "혼합룸,여성+가족룸,남성+가족룸[100분]" &&
                  "hidden sm:block",
                currentRoom.name === room.name && "bg-golden text-white"
              )}
            >
              <div
                className={cn(
                  "hidden font-bold sm:block sm:min-h-14",
                  room.type.includes("MIX")
                    ? "text-wrap break-keep"
                    : "text-nowrap"
                )}
              >
                {room.name}
              </div>
              <div
                className={cn(
                  "whitespace-pre-line font-bold sm:hidden sm:min-h-14",
                  !room.type.includes("MIX") && "text-nowrap"
                )}
              >
                {room.type.includes("MIX")
                  ? room.name
                  : room.name.replace("[", "\n[")}
              </div>
              <div className="my-auto">
                {room.price?.toLocaleString()}원
                <span className="block sm:inline">{room.extra}</span>
              </div>
              <div className="hidden sm:mt-6 sm:block">{room.last}</div>
              <div className="whitespace-pre-line sm:mt-6 sm:hidden">
                {room.last.replace("1인당", "1인당\n")}
              </div>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Step2;
