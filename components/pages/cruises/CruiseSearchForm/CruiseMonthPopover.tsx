"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CRUISE_MONTH_YEARS_AHEAD } from "@/constants/cruiseOptions";
import { cn } from "@/lib/utils";
import {
  expandMonthRange,
  formatMonthLabel,
  formatSelectedMonthsSummary,
  getCruiseMonthYears,
  getMonthRangeBounds,
  getMonthSelectionState,
  getMonthsForYear,
  isMonthSelectable,
  type CruiseMonthRange,
} from "@/utils/cruiseHelpers";

type Props = {
  selectedMonths: string[];
  onChange: (months: string[]) => void;
  error?: string;
  mobileStyle?: boolean;
};

function CruiseMonthPopover({
  selectedMonths,
  onChange,
  error,
  mobileStyle = false,
}: Props) {
  const t = useTranslations("CruiseSearchForm");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<CruiseMonthRange>(() =>
    getMonthRangeBounds(selectedMonths),
  );

  const years = useMemo(
    () => getCruiseMonthYears(new Date(), CRUISE_MONTH_YEARS_AHEAD),
    [],
  );

  const confirmedRange = useMemo(
    () => getMonthRangeBounds(selectedMonths),
    [selectedMonths],
  );

  const rangeMonthCount = useMemo(() => {
    if (!confirmedRange.start || !confirmedRange.end) {
      return selectedMonths.length;
    }
    return expandMonthRange(confirmedRange.start, confirmedRange.end).length;
  }, [confirmedRange, selectedMonths.length]);

  const summaryLabel = selectedMonths.length
    ? formatSelectedMonthsSummary(selectedMonths, locale)
    : t("selectDates");

  const monthsCountLabel = selectedMonths.length
    ? t("monthsSelected", { count: rangeMonthCount })
    : t("selectDatesHint");

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftRange(getMonthRangeBounds(selectedMonths));
    }
    setOpen(nextOpen);
  };

  const selectMonth = (monthKey: string) => {
    if (!isMonthSelectable(monthKey)) return;

    setDraftRange((prev) => {
      // First click, or third click after a complete range → new start
      if (!prev.start || (prev.start && prev.end)) {
        return { start: monthKey, end: null };
      }

      // Second click → end (normalize so start <= end)
      if (monthKey < prev.start) {
        return { start: monthKey, end: prev.start };
      }

      return { start: prev.start, end: monthKey };
    });
  };

  const handleConfirm = () => {
    if (!draftRange.start) return;

    const start = draftRange.start;
    const end = draftRange.end || draftRange.start;
    const lo = start <= end ? start : end;
    const hi = start <= end ? end : start;

    onChange(lo === hi ? [lo] : [lo, hi]);
    setOpen(false);
  };

  const canConfirm = Boolean(draftRange.start);

  return (
    <div className="relative min-w-0 flex-1">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          {mobileStyle ? (
            <button
              type="button"
              className="flex h-[54px] w-full items-center gap-2.5 px-1 text-start"
            >
              <CalendarDays size={18} className="shrink-0 text-gray-600" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] leading-none text-gray-500">
                  {t("datesLabel")}
                </p>
                <p className="mt-0.5 truncate text-[15px] font-medium text-black">
                  {summaryLabel}
                </p>
                <p className="truncate text-[11px] text-gray-500">
                  {monthsCountLabel}
                </p>
              </div>
              <ChevronDown size={18} className="shrink-0 text-gray-400" />
            </button>
          ) : (
            <button
              type="button"
              className={cn(
                "flex h-[58px] w-full items-center gap-3 rounded-sm border px-3 text-start transition-colors hover:border-primary/40",
                error ? "border-red-400" : "border-gray-300",
              )}
            >
              <CalendarDays size={20} className="shrink-0 text-gray-600" />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] leading-none text-gray-500">
                  {t("datesLabel")}
                </p>
                <p className="mt-1 truncate text-[15px] font-medium text-black">
                  {summaryLabel}
                </p>
              </div>
              <ChevronDown size={18} className="shrink-0 text-gray-400" />
            </button>
          )}
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="bottom"
          sideOffset={8}
          className="w-[min(100vw-32px,420px)] rounded-md border border-gray-200 bg-white p-4 shadow-xl"
        >
          <p className="mb-4 text-sm font-semibold text-gray-900">
            {t("datesLabel")}
          </p>

          <div className="max-h-[360px] space-y-5 overflow-y-auto pe-1">
            {years.map((year) => (
              <div key={year}>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                  <CalendarDays className="size-4" />
                  <span>{year}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {getMonthsForYear(year).map((monthKey) => {
                    const selectable = isMonthSelectable(monthKey);
                    const state = selectable
                      ? getMonthSelectionState(monthKey, draftRange)
                      : "none";

                    return (
                      <button
                        key={monthKey}
                        type="button"
                        disabled={!selectable}
                        onClick={() => selectMonth(monthKey)}
                        className={cn(
                          "rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors",
                          !selectable &&
                            "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300",
                          selectable &&
                            state === "none" &&
                            "border-gray-200 bg-white text-gray-800 hover:border-primary/40",
                          selectable &&
                            state === "in-range" &&
                            "border-primary/20 bg-primary/15 text-gray-900",
                          selectable &&
                            state === "edge" &&
                            "border-primary bg-primary text-white",
                        )}
                      >
                        {formatMonthLabel(monthKey, locale, "long")}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Check className="size-4" />
            {t("confirmDates")}
          </button>
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default CruiseMonthPopover;
