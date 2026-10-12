"use client";

import type { ReactNode, SyntheticEvent } from "react";
import { cn } from "@/lib/utils";

type BookingCardActionsProps = {
  children: ReactNode;
  className?: string;
};

function stopCardNavigation(event: SyntheticEvent) {
  event.stopPropagation();
}

export default function BookingCardActions({
  children,
  className,
}: BookingCardActionsProps) {
  return (
    <div
      className={cn("flex items-center gap-3", className)}
      onClick={stopCardNavigation}
      onPointerDown={stopCardNavigation}
    >
      {children}
    </div>
  );
}
