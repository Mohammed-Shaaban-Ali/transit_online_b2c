"use client";

import { useMemo, useState } from "react";
import { ChevronDown, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CounterRow from "@/components/pages/flights-test/FlightsTestHero/Form/components/CounterRow";

const MAX_ADULTS = 9;
const MAX_CHILDREN = 9;
const MAX_INFANTS = 9;

type Props = {
  adults: number;
  children: number;
  infants: number;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
  onInfantsChange: (value: number) => void;
  mobileStyle?: boolean;
};

function RizePassengersPopover({
  adults,
  children,
  infants,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  mobileStyle = false,
}: Props) {
  const tForm = useTranslations("RizeSearchForm");
  const t = useTranslations("RizeSearchForm.Passengers");
  const [open, setOpen] = useState(false);

  const triggerPassengersLabel = useMemo(() => {
    const totalPassengers = adults + children + infants;
    const passengerText =
      totalPassengers === 1 ? t("passenger") : t("passengers");
    return `${totalPassengers} ${passengerText}`;
  }, [adults, children, infants, t]);

  const detailedPassengersLabel = useMemo(() => {
    const parts: string[] = [];
    if (adults > 0) parts.push(`${adults} ${t("adults")}`);
    if (children > 0) parts.push(`${children} ${t("children")}`);
    if (infants > 0) parts.push(`${infants} ${t("infantsLap")}`);
    return parts.join(" · ");
  }, [adults, children, infants, t]);

  const handleAdultsChange = (value: number) => {
    const newAdults = Math.max(1, Math.min(MAX_ADULTS, value));
    onAdultsChange(newAdults);
    if (newAdults < infants) {
      onInfantsChange(newAdults);
    }
  };

  return (
    <div className="relative min-w-0 flex-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {mobileStyle ? (
            <button
              type="button"
              className="flex h-[54px] w-full items-center gap-2.5 px-1 text-start"
            >
              <UserIcon size={18} className="shrink-0 text-gray-600" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] leading-none text-gray-500">
                  {tForm("passengersLabel")}
                </p>
                <p className="mt-0.5 truncate text-[15px] font-medium text-black">
                  {triggerPassengersLabel}
                </p>
              </div>
              <ChevronDown size={18} className="shrink-0 text-gray-400" />
            </button>
          ) : (
            <button
              type="button"
              className="flex h-[58px] w-full items-center gap-3 rounded-sm border border-gray-300 px-3 text-start transition-colors hover:border-primary/40"
            >
              <UserIcon size={20} className="shrink-0 text-gray-600" />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] leading-none text-gray-500">
                  {tForm("passengersLabel")}
                </p>
                <p className="mt-1 truncate text-[15px] font-medium text-black">
                  {triggerPassengersLabel}
                </p>
              </div>
              <ChevronDown size={18} className="shrink-0 text-gray-400" />
            </button>
          )}
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="bottom"
          sideOffset={-58}
          avoidCollisions={false}
          className="w-[min(100vw-32px,450px)] rounded-md border border-gray-200 bg-white p-4 shadow-xl"
        >
          <div className="mb-4 flex items-center justify-end gap-2 border-b border-gray-200 pb-3 text-[16px]">
            <UserIcon size={20} className="fill-gray-700" />
            <span>{detailedPassengersLabel || triggerPassengersLabel}</span>
          </div>

          {/* <p className="mb-5 text-[14px] text-gray-700">
            {t("selectPassengersHint")}
          </p> */}

          <CounterRow
            title={t("adults")}
            subtitle={t("adultsAge")}
            value={adults}
            onMinus={() => handleAdultsChange(adults - 1)}
            onPlus={() => handleAdultsChange(adults + 1)}
          />
          <CounterRow
            title={t("children")}
            subtitle={t("childrenAge")}
            value={children}
            onMinus={() => onChildrenChange(Math.max(0, children - 1))}
            onPlus={() =>
              onChildrenChange(Math.min(MAX_CHILDREN, children + 1))
            }
          />
          <CounterRow
            title={t("infantsLap")}
            subtitle={t("infantsAge")}
            value={infants}
            onMinus={() => onInfantsChange(Math.max(0, infants - 1))}
            onPlus={() =>
              onInfantsChange(Math.min(MAX_INFANTS, adults, infants + 1))
            }
          />

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md bg-primary px-5 py-2 text-[14px] font-semibold text-white hover:bg-primary/90"
            >
              {t("done")}
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default RizePassengersPopover;
