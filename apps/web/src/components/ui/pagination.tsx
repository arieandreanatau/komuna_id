"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/types/api";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ meta, onPageChange, className }: PaginationProps) {
  const { current_page, last_page } = meta;

  if (last_page <= 1) return null;

  const pages: (number | "...")[] = [];
  if (last_page <= 7) {
    for (let i = 1; i <= last_page; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current_page > 3) pages.push("...");
    const start = Math.max(2, current_page - 1);
    const end = Math.min(last_page - 1, current_page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current_page < last_page - 2) pages.push("...");
    pages.push(last_page);
  }

  return (
    <nav className={cn("flex items-center justify-center gap-1", className)} aria-label="Pagination">
      <button
        onClick={() => onPageChange(current_page - 1)}
        disabled={current_page <= 1}
        className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        Previous
      </button>
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="inline-flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              current_page === page && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(current_page + 1)}
        disabled={current_page >= last_page}
        className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}
