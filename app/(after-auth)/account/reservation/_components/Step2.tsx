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
    if (persons.men && persons.women) {
      return room.name.includes("혼합룸");
    }
    if (persons.men && !persons.women) {
      return room.name.includes("남성룸") || room.name.includes("혼합룸");
    }
    if (!persons.men && persons.women) {
      return room.name.includes("여성룸") || room.name.includes("혼합룸");
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
    const totalPeople =
      persons.men + persons.women + persons.children + persons.infants;

    if (room.name.includes("혼합룸")) {
      if (totalPeople > 6) return alert("최대 6명까지 가능합니다.");
    } else {
      if (totalPeople > 3) return alert("최대 3명까지 가능합니다.");
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
