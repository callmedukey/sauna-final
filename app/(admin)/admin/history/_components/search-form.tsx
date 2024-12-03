"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { ko } from "date-fns/locale";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [nameInput, setNameInput] = useState(searchParams.get("name") ?? "");
  const debouncedName = useDebounce(nameInput, 500);

  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      // Reset to page 1 when search params change
      newSearchParams.set("page", "1");

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Effect for handling debounced name changes
  useEffect(() => {
    router.push(`?${createQueryString({ name: debouncedName || null })}`);
  }, [debouncedName, createQueryString, router]);

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-2 block">예약자 이름</label>
        <Input
          placeholder="이름으로 검색"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">시작일</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate
                ? format(new Date(startDate), "yyyy년 MM월 dd일")
                : "시작일 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              locale={ko}
              selected={startDate ? new Date(startDate) : undefined}
              onSelect={(date) => {
                router.push(
                  `?${createQueryString({
                    startDate: date ? format(date, "yyyy/MM/dd") : null,
                  })}`
                );
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">종료일</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate
                ? format(new Date(endDate), "yyyy년 MM월 dd일")
                : "종료일 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              locale={ko}
              mode="single"
              selected={endDate ? new Date(endDate) : undefined}
              onSelect={(date) => {
                router.push(
                  `?${createQueryString({
                    endDate: date ? format(date, "yyyy/MM/dd") : null,
                  })}`
                );
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          router.push("?");
        }}
      >
        초기화
      </Button>
    </div>
  );
}
