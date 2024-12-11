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

    if (persons.men > 0 && persons.women > 0) {
      // When both men and women are selected, show MIX room
      return room.type.includes("MIX");
    }
    if (persons.men > 0 && persons.women === 0) {
      // Show men's rooms and men's family rooms for male groups
      // Always show family rooms if there are children/infants
      return (
        room.name.includes("남성룸") ||
        (hasChildren && room.name.includes("남성+가족룸")) ||
        (!hasChildren && persons.men > 1 && room.name.includes("남성+가족룸"))
      );
    }
    if (persons.men === 0 && persons.women > 0) {
      // Show women's rooms and women's family rooms for female groups
      // Always show family rooms if there are children/infants
      return (
        room.name.includes("여성룸") ||
        (hasChildren && room.name.includes("여성+가족룸")) ||
        (!hasChildren && persons.women > 1 && room.name.includes("여성+가족룸"))
      );
    }
    return false;
  });

  const handleRoomLogic = (room: {
    name: string;
    price: number;
    type: string;
    extra: string;
    last: string;
  }) => {
    const adultCount = persons.men + persons.women;
    const childCount = persons.children + persons.infants;

    // Get base max capacity based on room type
    const baseMaxCapacity = room.type.includes("MIX")
      ? 6
      : room.type.includes("FAMILY")
      ? 4
      : 3;

    // For family rooms, one child/infant can count towards base capacity
    const actualAdultCount = adultCount;
    const childrenForBaseCapacity =
      room.type.includes("FAMILY") && adultCount === 1 ? 1 : 0;

    // Check if adults exceed base capacity
    if (actualAdultCount > baseMaxCapacity) {
      return alert(`성인은 최대 ${baseMaxCapacity}명까지 가능합니다.`);
    }

    // Calculate remaining capacity after base capacity is filled
    const remainingCapacity = baseMaxCapacity - actualAdultCount;
    const additionalChildrenCount = childCount - childrenForBaseCapacity;

    // If room is at max capacity, then limit additional children/infants to 2
    if (actualAdultCount === baseMaxCapacity && additionalChildrenCount > 2) {
      return alert(
        "최대 인원 초과 시 어린이와 유아는 합산 최대 2명까지 추가 가능합니다."
      );
    }

    // If room is not at max capacity, allow more children/infants
    if (additionalChildrenCount > remainingCapacity + 2) {
      return alert(`현재 선택하신 인원이 최대 인원을 초과합니다.`);
    }

    return handleRoom(room);
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
        <span>step 2</span>
        <span className="font-bold">룸 선택</span>
      </h2>
      <div className="grid grid-cols-2 ~gap-[1.25rem]/[0.31rem] sm:flex sm:flex-wrap">
        {roomList.map((room) => (
          <button
            onClick={() => handleRoomLogic(room)}
            key={room.name}
            className={cn(
              "min-w-0 flex-none transition duration-300 basis-[17.5rem] w-[17.5rem] max-w-full ~py-[0.625rem]/[0.75rem] flex-all-center flex-col text-center ~text-xs/base border border-siteTextGray gap-y-[0.625rem] sm:gap-y-[revert]",
              room.name === "혼합룸+대형사우나룸[100분]" && "sm:hidden",
              room.name === "혼합룸,여성+가족룸,남성+가족룸[100분]" &&
                "hidden sm:block",
              currentRoom.name === room.name && "bg-golden text-white"
            )}
          >
            <div className="hidden text-nowrap font-bold sm:block sm:min-h-14">
              {room.name}
            </div>
            <div className="whitespace-pre-line font-bold sm:hidden sm:min-h-14">
              {room.name.replace("[", "\n[")}
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
    </motion.div>
  );
};

export default Step2;
