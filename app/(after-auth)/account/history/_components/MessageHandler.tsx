"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MessageHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if ((success || error) && message) {
      alert(message);
      // Remove query parameters after showing the message
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      url.searchParams.delete("error");
      url.searchParams.delete("message");
      router.replace(url.toString());
    }
  }, [searchParams, router]);

  return null;
}
