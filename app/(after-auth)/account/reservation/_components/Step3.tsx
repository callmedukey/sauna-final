import type { Reservation } from "@prisma/client";
import React from "react";

const Step3 = ({
  handleTime,
  reservations,
  handleDate,
}: {
  reservations: Pick<Reservation, "date" | "time" | "id">[];
  handleTime: (time: string) => void;
  handleDate: (date: string) => void;
}) => {
  return <div>Step3</div>;
};

export default Step3;
