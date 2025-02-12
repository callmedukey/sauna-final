"use client";

import type { RoomType, SpecialDate } from "@prisma/client";
import { format } from "date-fns";
import { AnimatePresence } from "motion/react";
import { useState } from "react";

import Step0 from "./Step0";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

interface Props {
  reservations: {
    date: string;
    time: string;
    id: string;
    roomType: RoomType;
  }[];
  points: number;
  specialDates: Pick<SpecialDate, "date" | "type" | "discount">[];
}

const ReservationControl = ({ reservations, points, specialDates }: Props) => {
  const [people, setPeople] = useState<{
    men: number;
    women: number;
    children: number;
    infants: number;
  }>({
    men: 0,
    women: 0,
    children: 0,
    infants: 0,
  });
  const [peopleConfirmed, setPeopleConfirmed] = useState(false);

  const [room, setRoom] = useState({
    name: "",
    price: 0,
    type: "",
    extra: "",
    last: "",
  });

  const [date, setDate] = useState(format(new Date(), "yyyy/MM/dd"));
  const [time, setTime] = useState("");
  const [usedPoint, setUsedPoint] = useState(0);
  const [message, setMessage] = useState("");

  const handleReset = () => {
    setPeopleConfirmed(false);
    setRoom({
      name: "",
      price: 0,
      type: "",
      extra: "",
      last: "",
    });
    setDate(format(new Date(), "yyyy/MM/dd"));
    setTime("");
    setMessage("");
    setPeople({
      men: 0,
      women: 0,
      children: 0,
      infants: 0,
    });
  };

  return (
    <article className="mx-auto max-w-[55rem] ~px-[0rem]/[4.5rem] ~pt-[3.125rem]/[7.5rem]">
      <h1 className="page-title break-keep ~mb-8/16">
        솔로사우나 레포_노량진점 사우나 이용 요금표
      </h1>
      <AnimatePresence>
        <Step0 key="step0" />
        <Step1
          key="step1"
          people={people}
          handlePeople={setPeople}
          handlePeopleConfirmed={setPeopleConfirmed}
          handleReset={handleReset}
          confirmed={peopleConfirmed}
        />
        {peopleConfirmed && (
          <Step2
            key="step2"
            handleRoom={setRoom}
            currentRoom={room}
            persons={people}
          />
        )}
        {peopleConfirmed && room.name.trim() !== "" && (
          <Step3
            key="step3"
            handleTime={setTime}
            reservations={reservations}
            handleDate={setDate}
            selectedRoom={room}
            selectedTime={time}
            specialDates={specialDates}
          />
        )}
        {date && time && (
          <Step4
            key="step4"
            selectedRoom={room}
            persons={people}
            selectedDate={date}
            handleMessage={setMessage}
            usedPoint={usedPoint}
            maxPoint={points}
            selectedTime={time}
            currentMessage={message}
            handleUsedPoint={setUsedPoint}
            specialDates={specialDates}
          />
        )}
      </AnimatePresence>
    </article>
  );
};

export default ReservationControl;
