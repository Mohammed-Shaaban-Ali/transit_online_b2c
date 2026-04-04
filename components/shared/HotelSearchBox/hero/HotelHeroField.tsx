import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  active?: boolean;
  className?: string;
};

/** Single segment in the horizontal hero search bar (light highlight when active) */
export function HotelHeroField({ children, active, className }: Props) {
  return (
    <div
      className={cn(
        "relative flex min-h-[56px] min-w-0 flex-1 items-center gap-2 px-3 sm:px-4 transition-colors",
        active && "bg-sky-50/90",
        className
      )}
    >
      {children}
    </div>
  );
}
