"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function MessageHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (success && message) {
      alert(message);
    } else if (error && message) {
      alert(message);
    }
  }, [searchParams]);

  return null;
} 