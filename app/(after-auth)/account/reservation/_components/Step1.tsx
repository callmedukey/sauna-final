import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { RoomType, SpecialDate } from "@prisma/client";

const instructions = [
  "룸별 인원제한 - 일반룸 (1명~3명) / 일반룸+대형사우나 (3명~6명)",
  "만6세 미만 유아는 무료로 입장할 수 있습니다.",
  "만6세~12세 어린이의 입장료는 20,000원입니다.",
  "솔로사우나 노량진점에서는 남성과 여성이 함께 이용할 수 있는 대형사우나룸이 제공됩니다. 혼성 이용 가능 공간은 대형사우나룸에 한정됩니다. (샤워룸은 공용 사용 불가)",
  "이용제한 인원 수 내에서는 현장에서 추가 인원 결제 가능합니다. (이용제한 인원 수를 초과할 경우 입장이 제한이 될 수 있습니다.)",
  "예약에 도움이 필요하신 고객님께서는 편하게 전화주시면 안내해드리겠습니다.\n(tel. 070-8860-8553)",
];

interface Props {
  people: {
    children: number;
    infants: number;
    men: number;
    women: number;
  };
  handlePeople: (people: {
    children: number;
    infants: number;
    men: number;
    women: number;
  }) => void;
  handlePeopleConfirmed: (confirmed: boolean) => void;
  handleReset: () => void;
  confirmed: boolean;
  reservations: {
    date: string;
    time: string;
    id: string;
    roomType: RoomType;
  }[];
  specialDates: SpecialDate[];
}

export default function Step1({
  people,
  handlePeople,
  handlePeopleConfirmed,
  handleReset,
  confirmed,
  reservations,
  specialDates,
}: Props) {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  const handleDateSelect = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedDate(dateStr);
    handlePeopleConfirmed(true);
  };

  const handleUpdate = (
    type: "children" | "infants" | "men" | "women",
    value: number
  ) => {
    if (confirmed) {
      handleReset();
    }

    handlePeople({
      ...people,
      [type]: Math.max(0, people[type] + value),
    });
  };

  const isDateDisabled = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const specialDate = specialDates.find(
      (sd) => sd.date.replace(/\//g, "-") === dateStr
    );

    if (specialDate?.type === "BLOCKED") {
      return true;
    }

    return false;
  };

  const getDayClassNames = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const specialDate = specialDates.find(
      (sd) => sd.date.replace(/\//g, "-") === dateStr
    );

    let classes = "relative";

    if (specialDate?.type === "DISCOUNT") {
      classes += " bg-green-100";
    }

    return classes;
  };

  const renderDayContents = (day: number, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const specialDate = specialDates.find(
      (sd) => sd.date.replace(/\//g, "-") === dateStr
    );

    return (
      <div className="relative">
        {day}
        {specialDate?.type === "DISCOUNT" && (
          <div className="absolute -bottom-4 left-0 right-0 text-xs text-green-600">
            {specialDate.discount}% OFF
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1 className="step-title">
        <span>step 1</span>
        <span className="font-bold">인원</span>
      </h1>
      <section className="flex flex-col justify-center ~mt-[1.625rem]/[3.5rem] sm:flex-row sm:flex-wrap">
        <div className="mx-auto grid ~gap-x-[1.6875rem]/[7.25rem] ~gap-y-[1.25rem]/[1.6875rem] sm:grid-cols-2 sm:grid-rows-2">
          <div className="flex gap-[1.6875rem]">
            <div className="step-one-title-container">
              <span className="step-one-title">성인 여성</span>
              <span className="step-one-sub-title">만 12세 이상</span>
            </div>
            <div className="step-one-button-container">
              <button onClick={() => handleUpdate("women", -1)}>
                <MinusCircledIcon className="size-[1.1325rem]" />
              </button>
              <span>{people.women}</span>
              <button onClick={() => handleUpdate("women", 1)}>
                <PlusCircledIcon className="size-[1.1325rem]" />
              </button>
            </div>
          </div>
          <div className="flex gap-[1.6875rem]">
            <div className="step-one-title-container">
              <span className="step-one-title">성인 남성</span>
              <span className="step-one-sub-title">만 12세 이상</span>
            </div>
            <div className="step-one-button-container">
              <button onClick={() => handleUpdate("men", -1)}>
                <MinusCircledIcon className="size-[1.1325rem]" />
              </button>
              <span>{people.men}</span>
              <button onClick={() => handleUpdate("men", 1)}>
                <PlusCircledIcon className="size-[1.1325rem]" />
              </button>
            </div>
          </div>
          <div className="flex gap-[1.6875rem]">
            <div className="step-one-title-container">
              <span className="step-one-title">어린이</span>
              <span className="step-one-sub-title">만 6 - 12 세</span>
            </div>
            <div className="step-one-button-container">
              <button onClick={() => handleUpdate("children", -1)}>
                <MinusCircledIcon className="size-[1.1325rem]" />
              </button>
              <span>{people.children}</span>
              <button onClick={() => handleUpdate("children", 1)}>
                <PlusCircledIcon className="size-[1.1325rem]" />
              </button>
            </div>
          </div>
          <div className="flex gap-[1.6875rem]">
            <div className="step-one-title-container">
              <span className="step-one-title">유아</span>
              <span className="step-one-sub-title">만 6세 미만</span>
            </div>
            <div className="step-one-button-container">
              <button onClick={() => handleUpdate("infants", -1)}>
                <MinusCircledIcon className="size-[1.1325rem]" />
              </button>
              <span>{people.infants}</span>
              <button onClick={() => handleUpdate("infants", 1)}>
                <PlusCircledIcon className="size-[1.1325rem]" />
              </button>
            </div>
          </div>
        </div>
        <div className="my-5 flex items-center justify-center sm:my-0 sm:shrink-0 sm:grow sm:justify-end">
          <Button
            className="rounded-md bg-golden p-2 text-base font-normal text-white sm:ml-auto sm:mr-0"
            variant="ringHover"
            disabled={
              people.men + people.women + people.children + people.infants === 0
            }
            type="button"
            onClick={() => handlePeopleConfirmed(true)}
          >
            예약 인원 확인
          </Button>
        </div>
      </section>
      <ul className=" list-outside list-disc border-b-2 border-b-siteBlack border-t-siteOddGray px-4 pb-[3.12rem] pt-0 text-xs text-siteTextGray ~mt-[1.25rem]/[3.125rem] sm:border-t sm:px-0 sm:py-5">
        {instructions.map((instruction, index) => (
          <li
            key={index}
            className="mx-auto max-w-[27.5rem] whitespace-pre-line leading-[140%] tracking-[0.0075rem] sm:mx-[revert]"
          >
            {instruction}
          </li>
        ))}
      </ul>
    </div>
  );
}
