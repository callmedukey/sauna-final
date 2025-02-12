import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import React from "react";

import { Button } from "@/components/ui/button";

const instructions = [
  "예약시간 변동은 예약시간 앞뒤 상황에 따라 변경이 불가할 수 있습니다.",
  "이용제한 인원 수 내에서는 현장에서 추가 인원 결제 가능합니다. (이용제한 인원 수를 초과 할 경우 입장이\n제한이 될 수 있습니다.)",
  "예약에 도움이 필요하신 고객님께서는 편하게 전화주시면 안내해드리겠습니다.\n(tel.070-8860-8553)",
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
}

export default function Step1({
  people,
  handlePeople,
  handlePeopleConfirmed,
  handleReset,
  confirmed,
}: Props) {
  const handleUpdate = (
    type: "children" | "infants" | "men" | "women",
    value: number
  ) => {
    if (confirmed) {
      handleReset();
    }

    const newValue = people[type] + value;

    // Return early if trying to exceed maximum limits
    if ((type === "men" || type === "women") && newValue > 4) return;
    if (type === "children" && newValue > 2) return;
    if (type === "infants" && newValue > 2) return;

    handlePeople({
      ...people,
      [type]: Math.max(0, newValue),
    });
  };

  return (
    <div>
      <h1 className="step-title">
        <span className="">step 1</span>
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
      <ul className="flex flex-col border-b-2 border-b-siteBlack border-t-siteOddGray px-4 py-0 text-xs text-siteTextGray ~mt-[1.25rem]/[3.125rem] sm:border-t sm:px-0 sm:py-5">
        {instructions.map((instruction, index) => (
          <li
            key={index}
            className={`mx-auto flex whitespace-pre-line leading-[140%] tracking-[0.0075rem] sm:mx-[revert] ${
              index === 0 ? "pt-[1.875rem]" : ""
            } ${index === instructions.length - 1 ? "pb-20" : ""}`}
          >
            <span className="mr-2">-</span>
            <span>{instruction}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
