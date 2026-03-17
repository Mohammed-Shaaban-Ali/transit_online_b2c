"use client";

import { useMemo } from "react";
import { ChevronDown, UserIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CounterRow from "./CounterRow";
import { CabinClass } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adults: number;
  children: number;
  infants: number;
  cabinClass: CabinClass;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
  onInfantsChange: (value: number) => void;
  onCabinClassChange: (value: CabinClass) => void;
};

function PassengersPopover({
  open,
  onOpenChange,
  adults,
  children,
  infants,
  cabinClass,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  onCabinClassChange,
}: Props) {
  const detailedPassengersLabel = useMemo(() => {
    const parts: string[] = [];
    if (adults > 0) parts.push(`${adults} adult${adults > 1 ? "s" : ""}`);
    if (children > 0) parts.push(`${children} children`);
    if (infants > 0) parts.push(`${infants} infant`);
    return `${parts.join(" ")} · ${cabinClass}`;
  }, [adults, children, infants, cabinClass]);

  const triggerPassengersLabel = useMemo(() => {
    const totalPassengers = adults + children + infants;
    const passengerText = totalPassengers === 1 ? "Passenger" : "Passengers";
    return `${totalPassengers} ${passengerText} · ${cabinClass}`;
  }, [adults, children, infants, cabinClass]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-[58px] w-full items-center justify-between rounded-sm border border-gray-300 px-3"
        >
          <span className="flex items-center gap-2 text-[16px] font-medium">
            <UserIcon className="fill-gray-700" size={16} />
            {triggerPassengersLabel}
          </span>
          <ChevronDown size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={-58}
        avoidCollisions={false}
        className="w-[450px] rounded-md border border-gray-200 bg-white p-4 shadow-xl"
      >
        <div
          className="mb-4 flex items-center justify-end gap-2 border-b border-gray-200 pb-3 text-[16px] 
        "
        >
          <UserIcon size={20} className="fill-gray-700" />
          <span>{detailedPassengersLabel}</span>
        </div>

        <p className="mb-5 text-[14px] text-gray-700">
          Please select the exact number of passengers to view the best prices
        </p>

        <CounterRow
          title="Adults"
          subtitle="12+ years old"
          value={adults}
          onMinus={() => onAdultsChange(Math.max(1, adults - 1))}
          onPlus={() => onAdultsChange(Math.min(9, adults + 1))}
        />
        <CounterRow
          title="Children"
          subtitle="2-11 years old"
          value={children}
          onMinus={() => onChildrenChange(Math.max(0, children - 1))}
          onPlus={() => onChildrenChange(Math.min(9, children + 1))}
        />
        <CounterRow
          title="Infants on lap"
          subtitle="Under 2 years old"
          value={infants}
          onMinus={() => onInfantsChange(Math.max(0, infants - 1))}
          onPlus={() => onInfantsChange(Math.min(adults, infants + 1))}
        />

        <div className="mt-5">
          <select
            value={cabinClass}
            onChange={(e) => onCabinClassChange(e.target.value as CabinClass)}
            className="h-11 w-full rounded-sm border border-gray-300 px-2
             text-[16px] outline-none transition-colors focus:border-primary
             appearance-none cursor-pointer
             "
          >
            <option>Economy</option>
            <option>Business</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-11 min-w-[100px] cursor-pointer rounded-sm bg-primary  text-[16px] text-white 
            hover:bg-primary/80"
          >
            Done
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default PassengersPopover;
