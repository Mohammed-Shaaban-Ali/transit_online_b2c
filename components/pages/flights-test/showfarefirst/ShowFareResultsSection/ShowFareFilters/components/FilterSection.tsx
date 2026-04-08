"use client";

import { ReactNode, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
};

function FilterSection({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
  className,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={cn("border-b border-gray-300 pb-4", className)}>
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="mb-3 flex w-full items-center justify-between text-start
           text-gray-900 transition-colors cursor-pointer"
          aria-label={`Toggle ${title}`}
        >
          <h4 className="text-[16px] font-semibold">{title}</h4>
          <ChevronUp
            size={16}
            className={cn("transition-transform", !open && "rotate-180")}
          />
        </button>
      ) : (
        <div className="mb-1.5 flex items-center justify-between">
          <h4 className="text-[16px] font-medium">{title}</h4>
        </div>
      )}

      {(open || !collapsible) && children}
    </section>
  );
}

export default FilterSection;
