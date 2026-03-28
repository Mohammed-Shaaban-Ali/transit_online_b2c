"use client";

import { useMemo } from "react";
import { ChevronDown, UserIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import CounterRow from "./CounterRow";
import { CabinClass, FlightSearchFormValues } from "../types";

const MAX_ADULTS = 9;
const MAX_CHILDREN = 9;
const MAX_INFANTS = 9;

type Props = {
  form: UseFormReturn<FlightSearchFormValues>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function PassengersPopover({ form, open, onOpenChange }: Props) {
  const { watch, setValue } = form;
  const adults = watch("adults") || 1;
  const children = watch("children") || 0;
  const infants = watch("infants") || 0;
  const cabinClass = watch("cabinClass") || "ECONOMY";

  const handleAdultsChange = (value: number) => {
    const newAdults = Math.max(1, Math.min(MAX_ADULTS, value));
    setValue("adults", newAdults);
    if (newAdults < infants) {
      setValue("infants", newAdults);
    }
  };

  const handleChildrenChange = (value: number) => {
    setValue("children", Math.max(0, Math.min(MAX_CHILDREN, value)));
  };

  const handleInfantsChange = (value: number) => {
    setValue("infants", Math.max(0, Math.min(MAX_INFANTS, adults, value)));
  };

  const handleCabinClassChange = (value: "ECONOMY" | "BUSINESS") => {
    setValue("cabinClass", value);
  };

  const cabinDisplayText = cabinClass === "ECONOMY" ? "Economy" : "Business";

  const detailedPassengersLabel = useMemo(() => {
    const parts: string[] = [];
    if (adults > 0) parts.push(`${adults} adult${adults > 1 ? "s" : ""}`);
    if (children > 0) parts.push(`${children} children`);
    if (infants > 0) parts.push(`${infants} infant`);
    return `${parts.join(" ")} · ${cabinDisplayText}`;
  }, [adults, children, infants, cabinDisplayText]);

  const triggerPassengersLabel = useMemo(() => {
    const totalPassengers = adults + children + infants;
    const passengerText = totalPassengers === 1 ? "Passenger" : "Passengers";
    return `${totalPassengers} ${passengerText} · ${cabinDisplayText}`;
  }, [adults, children, infants, cabinDisplayText]);

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
        <div className="mb-4 flex items-center justify-end gap-2 border-b border-gray-200 pb-3 text-[16px]">
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
          onMinus={() => handleAdultsChange(adults - 1)}
          onPlus={() => handleAdultsChange(adults + 1)}
        />
        <CounterRow
          title="Children"
          subtitle="2-11 years old"
          value={children}
          onMinus={() => handleChildrenChange(children - 1)}
          onPlus={() => handleChildrenChange(children + 1)}
        />
        <CounterRow
          title="Infants on lap"
          subtitle="Under 2 years old"
          value={infants}
          onMinus={() => handleInfantsChange(infants - 1)}
          onPlus={() => handleInfantsChange(Math.min(adults, infants + 1))}
        />

        <div className="mt-5">
          <select
            value={cabinClass}
            onChange={(e) => handleCabinClassChange(e.target.value as "ECONOMY" | "BUSINESS")}
            className="h-11 w-full rounded-sm border border-gray-300 px-2 text-[16px] outline-none transition-colors focus:border-primary appearance-none cursor-pointer"
          >
            <option value="ECONOMY">Economy</option>
            <option value="BUSINESS">Business</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-11 min-w-[100px] cursor-pointer rounded-sm bg-primary text-[16px] text-white hover:bg-primary/80"
          >
            Done
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default PassengersPopover;
