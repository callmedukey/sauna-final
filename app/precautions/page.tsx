"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PrecautionsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/reservation');
  }, [router]);

  return null;
};

export default PrecautionsPage; 