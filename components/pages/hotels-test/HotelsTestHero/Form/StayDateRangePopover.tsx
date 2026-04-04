"use client";

import { useState } from "react";
import { UseFormReturn, useFormState } from "react-hook-form";
import { differenceInCalendarDays } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocale, useTranslations } from "next-intl";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import HotelRangeCalendarPanel from "./HotelRangeCalendarPanel";
import type { HotelsTestFormValues } from "./HotelsTestHotelSearchForm";

type Props = {
  form: UseFormReturn<HotelsTestFormValues>;
};

function StayDateRangePopover({ form }: Props) {
  const locale = useLocale();
  const t = useTranslations("HotelsTestPage.HotelSearchForm");
  const th = useTranslations("Components.HotelSearchBox.hero");
  const [open, setOpen] = useState(false);
  const [mountVersion, setMountVersion] = useState(0);

  const { errors } = useFormState({ control: form.control });
  const checkInMsg = errors.checkIn?.message as string | undefined;
  const checkOutMsg = errors.checkOut?.message as string | undefined;

  const checkIn = form.watch("checkIn");
  const checkOut = form.watch("checkOut");

  const openPopover = (next: boolean) => {
    if (next) {
      setMountVersion((v) => v + 1);
    }
    setOpen(next);
  };

  const formatHero = (dateStr: string) =>
    new Intl.DateTimeFormat(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr + "T12:00:00"));

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          differenceInCalendarDays(
            new Date(checkOut + "T12:00:00"),
            new Date(checkIn + "T12:00:00"),
          ),
        )
      : 0;

  const rangeLabel =
    checkIn && checkOut
      ? `${formatHero(checkIn)} - ${formatHero(checkOut)}`
      : checkIn
        ? `${formatHero(checkIn)} - …`
        : t("selectDates");

  return (
    <div className="relative flex  min-w-0 flex-1 flex-col self-stretch">
      <Popover open={open} onOpenChange={openPopover}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-full w-full min-w-0 flex-1 items-center gap-3 px-3.5 py-2 text-start  sm:px-2",
              "rounded-md border-0 bg-transparent transition-colors duration-150",
              "hover:bg-primary/10 data-[state=open]:bg-primary/10",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/25",
            )}
          >
            <Calendar
              className="size-[18px] shrink-0 text-neutral-900 sm:size-5"
              strokeWidth={1.5}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-[15px] font-bold leading-snug text-slate-900 sm:text-[16px]">
              {rangeLabel}
            </span>
            {nights > 0 && (
              <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-normal text-gray-600 sm:text-xs">
                {th("nightsBadge", { count: nights })}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={8}
          className="w-auto max-w-[calc(100vw-24px)] border-none bg-transparent p-0 shadow-none"
        >
          <HotelRangeCalendarPanel
            form={form}
            onConfirm={() => setOpen(false)}
            mountVersion={mountVersion}
          />
        </PopoverContent>
      </Popover>
      {(checkInMsg || checkOutMsg) && (
        <div className="mt-1 space-y-0.5 px-3.5">
          {checkInMsg ? (
            <p className="text-xs font-medium text-red-500">{checkInMsg}</p>
          ) : null}
          {checkOutMsg ? (
            <p className="text-xs font-medium text-red-500">{checkOutMsg}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default StayDateRangePopover;
