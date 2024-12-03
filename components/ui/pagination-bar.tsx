"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./button";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function PaginationBar({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationBarProps) {
  // Generate page numbers to show
  const pageNumbers = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    // Show all pages if total is less than max
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always show first page
    pageNumbers.push(1);

    // Calculate start and end of current window
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // Adjust window if at the edges
    if (currentPage <= 2) {
      end = 4;
    }
    if (currentPage >= totalPages - 1) {
      start = totalPages - 3;
    }

    // Add ellipsis if needed
    if (start > 2) {
      pageNumbers.push("...");
    }

    // Add pages in current window
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Always show last page
    pageNumbers.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === 1}
      >
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className={currentPage === 1 ? "pointer-events-none" : ""}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      {pageNumbers.map((page, index) => (
        <Button
          key={index}
          variant={currentPage === page ? "default" : "outline"}
          size="icon"
          asChild={typeof page === "number"}
          disabled={typeof page !== "number"}
        >
          {typeof page === "number" ? (
            <Link href={`${baseUrl}?page=${page}`}>{page}</Link>
          ) : (
            page
          )}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === totalPages}
      >
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className={currentPage === totalPages ? "pointer-events-none" : ""}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
} 