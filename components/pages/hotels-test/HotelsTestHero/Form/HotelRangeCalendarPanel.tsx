"use client";

/**
 * Range calendar only (no title row / no quick-date chips).
 * Uses defaultValue + remount key so Ark range selection behaves correctly (full range, not single day stuck).
 */
import React, { useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { format, differenceInCalendarDays } from "date-fns";
import { DatePicker, parseDate } from "@ark-ui/react/date-picker";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { HotelsTestFormValues } from "./HotelsTestHotelSearchForm";

type Props = {
  form: UseFormReturn<HotelsTestFormValues>;
  onConfirm: () => void;
  /** Bump when popover opens so calendar remounts with latest default range */
  mountVersion: number;
};

function ymdFromLocalDate(d: Date) {
  return format(d, "yyyy-MM-dd");
}

function HotelRangeCalendarPanel({ form, onConfirm, mountVersion }: Props) {
  const locale = useLocale();
  const t = useTranslations("HotelsTestPage.HotelSearchForm");
  const tc = useTranslations("Components.HotelSearchBox.DatePicker");

  const { watch, setValue, clearErrors, trigger } = form;
  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const numOfMonths = isMobile ? 1 : 2;

  const getDefaultRange = useMemo(() => {
    const values: unknown[] = [];
    if (checkIn) values.push(parseDate(new Date(checkIn + "T12:00:00")));
    if (checkOut) values.push(parseDate(new Date(checkOut + "T12:00:00")));
    return values;
  }, [checkIn, checkOut]);

  const formatDisplay = (dateStr: string) =>
    new Intl.DateTimeFormat(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr + "T12:00:00"));

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const a = new Date(checkIn + "T12:00:00");
    const b = new Date(checkOut + "T12:00:00");
    return Math.max(0, differenceInCalendarDays(b, a));
  }, [checkIn, checkOut]);

  const handleDateChange = (details: {
    value: { toString: () => string }[];
  }) => {
    if (details.value.length >= 1) {
      const raw = details.value[0].toString();
      const d = new Date(raw);
      setValue("checkIn", ymdFromLocalDate(d), { shouldValidate: true });
      clearErrors("checkIn");
      void trigger("checkIn");
    }
    if (details.value.length >= 2) {
      const raw = details.value[1].toString();
      const d = new Date(raw);
      setValue("checkOut", ymdFromLocalDate(d), { shouldValidate: true });
      clearErrors("checkOut");
      void trigger("checkOut");
    } else {
      setValue("checkOut", "", { shouldValidate: false });
    }
  };

  const footerLabel =
    checkIn && checkOut
      ? `${formatDisplay(checkIn)} ~ ${formatDisplay(checkOut)}`
      : checkIn
        ? `${formatDisplay(checkIn)} ~ ${tc("selectCheckOut")}`
        : null;

  return (
    <div className="flex w-[calc(100vw-32px)] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl sm:w-auto sm:min-w-0">
      <div className="flex justify-center px-1 pt-1.5 sm:px-2 sm:pt-2">
        <DatePicker.Root
          key={`stay-cal-${mountVersion}-${numOfMonths}`}
          inline
          defaultValue={getDefaultRange as never}
          selectionMode="range"
          timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
          numOfMonths={numOfMonths}
          locale={locale}
          onValueChange={handleDateChange}
          isDateUnavailable={(date) => {
            const today = new Date(new Date().setHours(0, 0, 0, 0));
            return date.toDate("UTC") < today;
          }}
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="w-full"
        >
          <DatePicker.Content className="inline-block w-full bg-white sm:w-auto">
            <DatePicker.View
              view="day"
              className={cn(
                "relative flex w-full sm:w-auto",
                numOfMonths > 1 &&
                  "divide-x divide-gray-200 rtl:divide-x-reverse",
                "rtl:flex-row-reverse",
              )}
            >
              <nav className="absolute top-0 z-10 flex w-full justify-between border-transparent px-0.5 rtl:flex-row-reverse">
                <DatePicker.PrevTrigger className="rounded p-1 text-gray-600 transition-colors hover:bg-gray-100">
                  <ChevronLeftIcon className="h-3.5 w-3.5 rtl:rotate-180" />
                </DatePicker.PrevTrigger>
                <DatePicker.NextTrigger className="rounded p-1 text-gray-600 transition-colors hover:bg-gray-100">
                  <ChevronRightIcon className="h-3.5 w-3.5 rtl:rotate-180" />
                </DatePicker.NextTrigger>
              </nav>
              <DatePicker.Context>
                {(api) =>
                  Array.from({ length: numOfMonths }).map((_, index) => {
                    const offset = api.getOffset({ months: index });
                    return (
                      <div
                        key={index}
                        className="w-full pb-1.5 sm:w-auto sm:px-1.5"
                      >
                        <DatePicker.ViewControl className="mx-5 mb-1.5 flex h-7 items-center justify-center sm:mx-6">
                          <DatePicker.ViewTrigger className="z-20 rounded px-1 py-0.5 text-[12px] font-bold text-gray-900 transition-colors hover:bg-gray-100 sm:text-[13px]">
                            <span>
                              {new Intl.DateTimeFormat(locale, {
                                month: "long",
                              }).format(
                                offset.visibleRange.start.toDate("UTC"),
                              )}{" "}
                              {offset.visibleRange.start.year}
                            </span>
                          </DatePicker.ViewTrigger>
                        </DatePicker.ViewControl>
                        <DatePicker.Table
                          className="w-full table-fixed sm:w-auto sm:table-auto"
                          dir={locale === "ar" ? "rtl" : "ltr"}
                        >
                          <DatePicker.TableHead>
                            <DatePicker.TableRow>
                              {api.weekDays.map((weekDay, id) => (
                                <DatePicker.TableHeader
                                  key={id}
                                  className="h-6 text-center text-[9px] font-semibold sm:h-7 sm:w-[32px] sm:text-[10px]"
                                >
                                  {weekDay.narrow ?? weekDay.short}
                                </DatePicker.TableHeader>
                              ))}
                            </DatePicker.TableRow>
                          </DatePicker.TableHead>
                          <DatePicker.TableBody>
                            {offset.weeks.map((week, id) => (
                              <DatePicker.TableRow key={id}>
                                {week.map((day, id) => (
                                  <DatePicker.TableCell
                                    key={id}
                                    value={day}
                                    className="p-0"
                                    visibleRange={offset.visibleRange}
                                  >
                                    <DatePicker.TableCellTrigger
                                      className={cn(
                                        "relative flex h-[30px] w-full cursor-pointer items-center justify-center text-[11px] font-semibold transition-colors sm:h-[32px] sm:w-[32px] sm:text-[12px]",
                                        "data-today:before:absolute data-today:before:left-0.5 data-today:before:top-1/2 data-today:before:-translate-y-1/2 data-today:before:text-[7px] data-today:before:leading-none data-today:before:text-primary data-today:before:content-['▸']",
                                        "data-outside-range:pointer-events-none data-outside-range:bg-transparent! data-outside-range:text-gray-300",
                                        "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:text-gray-300",
                                        "data-unavailable:pointer-events-none data-unavailable:cursor-not-allowed data-unavailable:text-gray-300 data-unavailable:line-through",
                                        "hover:bg-gray-100",
                                        /* شريط متصل: كل الأيام داخل النطاق بنفس لون الخلفية */
                                        "data-in-range:bg-primary data-in-range:text-white data-in-range:hover:bg-primary",
                                        /* الأيام الوسطى فقط: بدون تدوير — مربعة لتلاصق الشريط */
                                        "[&[data-in-range]:not([data-range-start]):not([data-range-end])]:rounded-none",
                                        /* بداية النطاق: تدوير خارجي يسار (LTR) أو يمين (RTL) فقط */
                                        locale === "ar"
                                          ? "data-range-start:rounded-r-md data-range-start:rounded-l-none data-range-start:bg-primary data-range-start:text-white data-range-start:hover:bg-primary"
                                          : "data-range-start:rounded-l-md data-range-start:rounded-r-none data-range-start:bg-primary data-range-start:text-white data-range-start:hover:bg-primary",
                                        locale === "ar"
                                          ? "data-range-end:rounded-l-md data-range-end:rounded-r-none data-range-end:bg-primary data-range-end:text-white data-range-end:hover:bg-primary"
                                          : "data-range-end:rounded-r-md data-range-end:rounded-l-none data-range-end:bg-primary data-range-end:text-white data-range-end:hover:bg-primary",
                                        /* يوم واحد (بداية = نهاية): قرص كامل */
                                        "data-range-start:data-range-end:rounded-md!",
                                        "data-selected:data-today:before:text-white",
                                        "data-range-start:data-today:before:text-white",
                                        "data-range-end:data-today:before:text-white",
                                      )}
                                    >
                                      {day.day}
                                    </DatePicker.TableCellTrigger>
                                  </DatePicker.TableCell>
                                ))}
                              </DatePicker.TableRow>
                            ))}
                          </DatePicker.TableBody>
                        </DatePicker.Table>
                      </div>
                    );
                  })
                }
              </DatePicker.Context>
            </DatePicker.View>

            <DatePicker.View view="month">
              <DatePicker.Context>
                {(api) => (
                  <>
                    <DatePicker.ViewControl className="mb-4 flex items-center justify-between px-3">
                      <DatePicker.PrevTrigger className="rounded-md p-1 text-gray-700 transition-colors hover:bg-gray-100">
                        <ChevronLeftIcon className="h-4 w-4 rtl:rotate-180" />
                      </DatePicker.PrevTrigger>
                      <DatePicker.ViewTrigger className="rounded-md px-2 py-1 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-100">
                        <DatePicker.RangeText />
                      </DatePicker.ViewTrigger>
                      <DatePicker.NextTrigger className="rounded-md p-1 text-gray-700 transition-colors hover:bg-gray-100">
                        <ChevronRightIcon className="h-4 w-4 rtl:rotate-180" />
                      </DatePicker.NextTrigger>
                    </DatePicker.ViewControl>
                    <DatePicker.Table className="w-full border-separate border-spacing-y-0.5 px-3">
                      <DatePicker.TableBody>
                        {api
                          .getMonthsGrid({ columns: 4, format: "short" })
                          .map((months, id) => (
                            <DatePicker.TableRow key={id}>
                              {months.map((month, id) => (
                                <DatePicker.TableCell
                                  key={id}
                                  value={month.value}
                                >
                                  <DatePicker.TableCellTrigger className="flex h-10 w-16 items-center justify-center rounded-lg text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 data-selected:bg-primary data-selected:text-white">
                                    {month.label}
                                  </DatePicker.TableCellTrigger>
                                </DatePicker.TableCell>
                              ))}
                            </DatePicker.TableRow>
                          ))}
                      </DatePicker.TableBody>
                    </DatePicker.Table>
                  </>
                )}
              </DatePicker.Context>
            </DatePicker.View>

            <DatePicker.View view="year">
              <DatePicker.Context>
                {(api) => (
                  <>
                    <DatePicker.ViewControl className="mb-4 flex items-center justify-between px-3">
                      <DatePicker.PrevTrigger className="rounded-md p-1 text-gray-700 transition-colors hover:bg-gray-100">
                        <ChevronLeftIcon className="h-4 w-4 rtl:rotate-180" />
                      </DatePicker.PrevTrigger>
                      <DatePicker.ViewTrigger className="rounded-md px-2 py-1 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-100">
                        <DatePicker.RangeText />
                      </DatePicker.ViewTrigger>
                      <DatePicker.NextTrigger className="rounded-md p-1 text-gray-700 transition-colors hover:bg-gray-100">
                        <ChevronRightIcon className="h-4 w-4 rtl:rotate-180" />
                      </DatePicker.NextTrigger>
                    </DatePicker.ViewControl>
                    <DatePicker.Table className="w-full border-separate border-spacing-y-0.5 px-3">
                      <DatePicker.TableBody>
                        {api.getYearsGrid({ columns: 4 }).map((years, id) => (
                          <DatePicker.TableRow key={id}>
                            {years.map((year, id) => (
                              <DatePicker.TableCell key={id} value={year.value}>
                                <DatePicker.TableCellTrigger className="flex h-10 w-16 items-center justify-center rounded-lg text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 data-selected:bg-primary data-selected:text-white">
                                  {year.label}
                                </DatePicker.TableCellTrigger>
                              </DatePicker.TableCell>
                            ))}
                          </DatePicker.TableRow>
                        ))}
                      </DatePicker.TableBody>
                    </DatePicker.Table>
                  </>
                )}
              </DatePicker.Context>
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Root>
      </div>

      <div className="flex flex-col items-end gap-1.5 border-t border-gray-100 px-2.5 py-2 sm:px-3 sm:py-2.5">
        <div className="w-full min-w-0 flex-1 text-end">
          {footerLabel ? (
            <>
              <p className="truncate text-[11px] font-bold text-gray-900 sm:text-[12px]">
                {footerLabel}
                {checkIn && checkOut && nights > 0 && (
                  <span className="text-primary">
                    {" "}
                    ({tc("nightsCount", { count: nights })})
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-[9px] text-gray-400 sm:text-[10px]">
                {tc("allDatesLocalTime")}
              </p>
            </>
          ) : (
            <p className="text-[10px] text-gray-400 sm:text-[11px]">
              {tc("selectDateToContinue")}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!checkIn || !checkOut}
          className="whitespace-nowrap rounded bg-primary px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:py-2 sm:text-[12px]"
        >
          {t("done")}
        </button>
      </div>
    </div>
  );
}

export default HotelRangeCalendarPanel;
