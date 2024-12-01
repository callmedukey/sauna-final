"use client";

import type { Reservation } from "@prisma/client";
import { useCallback, useState } from "react";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

const ReservationControl = ({
  reservations,
}: {
  reservations: Pick<Reservation, "date" | "time" | "id">[];
}) => {
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

  const [room, setRoom] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = useCallback((message: string) => {
    setMessage(message);
  }, []);

  const handleDate = useCallback((date: string) => {
    setDate(date);
  }, []);

  const handleTime = useCallback((time: string) => {
    setTime(time);
  }, []);

  const handleRoom = useCallback((room: string) => {
    setRoom(room);
  }, []);

  const handlePeople = useCallback(
    (people: {
      men: number;
      women: number;
      children: number;
      infants: number;
    }) => {
      setPeople(people);
    },
    []
  );

  return (
    <article className="mx-auto max-w-screen-lg ~px-[0rem]/[9.5rem]">
      <Step1 handlePeople={handlePeople} />
      <Step2 handleRoom={handleRoom} />
      <Step3
        handleTime={handleTime}
        reservations={reservations}
        handleDate={handleDate}
      />
      <Step4 handleMessage={handleMessage} />
    </article>
  );
};

export default ReservationControl;
