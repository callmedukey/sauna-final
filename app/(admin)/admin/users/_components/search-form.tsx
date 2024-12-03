"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [nameInput, setNameInput] = useState(searchParams.get("name") ?? "");
  const debouncedName = useDebounce(nameInput, 500);

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

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Effect for handling debounced name changes
  useEffect(() => {
    router.push(`?${createQueryString({ name: debouncedName || null })}`);
  }, [debouncedName, createQueryString, router]);

  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder="이름으로 검색"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
} 