"use client";

import { useState } from "react";
import SpecialDatesCalendar from "./_components/special-dates-calendar";
import SpecialDatesList from "./_components/special-dates-list";

export default function SettingsPage() {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleUpdate = () => {
    setUpdateTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">캘린더</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-shrink-0">
          <SpecialDatesCalendar onUpdate={handleUpdate} />
        </div>
        <div className="flex-1">
          <SpecialDatesList updateTrigger={updateTrigger} />
        </div>
      </div>
    </div>
  );
}
