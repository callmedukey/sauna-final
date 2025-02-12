"use client";

import { Reservation, SpecialDate } from "@prisma/client";
import React, { useState } from "react";

import PrecautionsContent from "./PrecautionContent";
import ReservationControl from "./ReservationControl";
import MessageHandler from "../../history/_components/MessageHandler";

type ReservationWithSelectedFields = Pick<
  Reservation,
  "id" | "date" | "time" | "roomType"
>;

type SpecialDateWithSelectedFields = Pick<
  SpecialDate,
  "date" | "type" | "discount"
>;

const ReservationClient = ({
  reservations,
  points,
  specialDates,
}: {
  reservations: ReservationWithSelectedFields[];
  points: number;
  specialDates: SpecialDateWithSelectedFields[];
}) => {
  const [showPrecautions, setShowPrecautions] = useState(true);

  if (showPrecautions) {
    return <PrecautionsContent setShowPrecautions={setShowPrecautions} />;
  }
  return (
    <>
      <MessageHandler />
      <ReservationControl
        reservations={reservations}
        points={points}
        specialDates={specialDates}
      />
    </>
  );
};
// Precautions content component

export default ReservationClient;
