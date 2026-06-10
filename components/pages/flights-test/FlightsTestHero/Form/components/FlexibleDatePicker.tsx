"use client";

import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { format, addDays, addMonths, startOfMonth } from "date-fns";
import { DatePicker, parseDate } from "@ark-ui/react/date-picker";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { FlightSearchFormValues } from "../types";

type Props = {
  form: UseFormReturn<FlightSearchFormValues>;
  onConfirm?: () => void;
};

function FlexibleDatePicker({ form, onConfirm }: Props) {
  const locale = useLocale();
  const t = useTranslations("FlightsTestForm.DatePicker");
  const [isMobile, setIsMobile] = useState(false);
  const [activeQuick, setActiveQuick] = useState<string | null>(null);

  const { watch, setValue, clearErrors, trigger } = form;
  const tripType = watch("tripType");
  const departureDate = watch("departureDate");
  const returnDate = watch("returnDate");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const numOfMonths = tripType === "oneWay" ? 1 : isMobile ? 1 : 2;

  const formatDisplay = (dateStr: string) =>
    new Intl.DateTimeFormat(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr));

  const getFooterLabel = () => {
    if (!departureDate) return null;
    if (tripType === "oneWay") {
      return `${t("depart")}: ${formatDisplay(departureDate)}`;
    }
    if (departureDate && returnDate) {
      return `${t("depart")}: ${formatDisplay(departureDate)} ~ ${formatDisplay(returnDate)}`;
    }
    if (departureDate) {
      return `${t("depart")}: ${formatDisplay(departureDate)} ~ ${t("selectReturn")}`;
    }
    return null;
  };

  const handleDateChange = (details: {
    value: { toString: () => string }[];
  }) => {
    setActiveQuick(null);
    if (tripType === "roundTrip") {
      if (details.value.length >= 1) {
        setValue(
          "departureDate",
          format(new Date(details.value[0].toString()), "yyyy-MM-dd"),
        );
        clearErrors("departureDate");
        trigger("departureDate");
      }
      if (details.value.length >= 2) {
        setValue(
          "returnDate",
          format(new Date(details.value[1].toString()), "yyyy-MM-dd"),
        );
        clearErrors("returnDate");
        trigger("returnDate");
      } else {
        setValue("returnDate", undefined);
      }
    } else {
      if (details.value.length >= 1) {
        setValue(
          "departureDate",
          format(new Date(details.value[0].toString()), "yyyy-MM-dd"),
        );
        clearErrors("departureDate");
        trigger("departureDate");
      }
    }
  };

  const getPickerValue = () => {
    if (tripType === "roundTrip") {
      const values = [];
      if (departureDate) values.push(parseDate(new Date(departureDate)));
      if (returnDate) values.push(parseDate(new Date(returnDate)));
      return values;
    }
    return departureDate ? [parseDate(new Date(departureDate))] : [];
  };

  const handleQuickSelect = (type: "next2weeks" | "nextMonth" | string) => {
    setActiveQuick(type);
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    if (type === "next2weeks") {
      const end = addDays(today, 13);
      setValue("departureDate", format(today, "yyyy-MM-dd"));
      setValue("returnDate", format(end, "yyyy-MM-dd"));
      clearErrors(["departureDate", "returnDate"]);
    } else if (type === "nextMonth") {
      const start = startOfMonth(addMonths(today, 1));
      const end = addDays(start, 29);
      setValue("departureDate", format(start, "yyyy-MM-dd"));
      setValue("returnDate", format(end, "yyyy-MM-dd"));
      clearErrors(["departureDate", "returnDate"]);
    } else {
      // Month quick-select key: "month-<0..11>" (stable across locales)
      const match = /^month-(\d{1,2})$/.exec(type);
      const monthIndex = match ? Number(match[1]) : -1;
      if (monthIndex >= 0 && monthIndex <= 11) {
        const year =
          today.getFullYear() + (monthIndex < today.getMonth() ? 1 : 0);
        const start = new Date(year, monthIndex, 1);
        if (start < today) start.setDate(today.getDate());
        const end = addDays(start, 29);
        setValue("departureDate", format(start, "yyyy-MM-dd"));
        setValue("returnDate", format(end, "yyyy-MM-dd"));
        clearErrors(["departureDate", "returnDate"]);
      }
    }
  };

  const upcomingMonths = Array.from({ length: 2 }, (_, i) => {
    const d = addMonths(new Date(), i + 1);
    const monthIndex = d.getMonth(); // 0..11
    return {
      label: new Intl.DateTimeFormat(locale, { month: "short" }).format(d),
      key: `month-${monthIndex}`,
    };
  });

  const footerLabel = getFooterLabel();

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-[calc(100vw-32px)] sm:w-auto sm:min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-1 px-2.5 py-1.5 border-b border-gray-100 flex-wrap sm:px-3 sm:py-2 sm:gap-1.5">
        <span className="text-[14px] font-bold text-gray-900 sm:text-[15px]">
          {t("headerTitle")}
        </span>
        <div className="flex items-center gap-1 flex-wrap">
          {tripType === "roundTrip" && (
            <>
              {[
                { key: "next2weeks", label: t("next2weeks") },
                { key: "nextMonth", label: t("nextMonth") },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => handleQuickSelect(btn.key)}
                  className={cn(
                    "rounded px-2 py-1 text-[10px] font-medium transition-colors whitespace-nowrap sm:px-2.5 sm:py-1 sm:text-[11px]",
                    activeQuick === btn.key
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200",
                  )}
                >
                  {btn.label}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Calendar */}
      <div className="flex justify-center px-1 pt-1.5 sm:px-2 sm:pt-2">
        <DatePicker.Root
          key={`${tripType}-${numOfMonths}`}
          inline
          value={getPickerValue()}
          selectionMode={tripType === "roundTrip" ? "range" : "single"}
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
          <DatePicker.Content className="bg-white w-full sm:w-auto sm:inline-block">
            <DatePicker.View
              view="day"
              className={cn(
                "flex relative w-full sm:w-auto",
                numOfMonths > 1 &&
                  "divide-x divide-gray-200 rtl:divide-x-reverse",
                "rtl:flex-row-reverse",
              )}
            >
              <nav className="absolute border-transparent w-full top-0 flex rtl:flex-row-reverse justify-between px-0.5 z-10">
                <DatePicker.PrevTrigger className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-600">
                  <ChevronLeftIcon className="w-3.5 h-3.5 rtl:rotate-180" />
                </DatePicker.PrevTrigger>
                <DatePicker.NextTrigger className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-600">
                  <ChevronRightIcon className="w-3.5 h-3.5 rtl:rotate-180" />
                </DatePicker.NextTrigger>
              </nav>
              <DatePicker.Context>
                {(api) =>
                  Array.from({ length: numOfMonths }).map((_, index) => {
                    const offset = api.getOffset({ months: index });
                    return (
                      <div
                        key={index}
                        className="pb-1.5 w-full sm:w-auto sm:px-1.5"
                      >
                        <DatePicker.ViewControl className="flex justify-center items-center mx-5 mb-1.5 h-7 sm:mx-6">
                          <DatePicker.ViewTrigger className="z-20 text-[12px] font-bold text-gray-900 hover:bg-gray-100 px-1 py-0.5 rounded transition-colors sm:text-[13px]">
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
                                  className="text-[9px] font-semibold h-6 text-center sm:text-[10px] sm:w-[32px] sm:h-7"
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
                                        "relative w-full h-[30px] text-[11px] sm:w-[32px] sm:h-[32px] sm:text-[12px] transition-colors flex items-center justify-center font-semibold cursor-pointer",
                                        "data-today:before:content-['▸'] data-today:before:absolute data-today:before:left-0.5 data-today:before:top-1/2 data-today:before:-translate-y-1/2 data-today:before:text-[7px] data-today:before:text-primary data-today:before:leading-none",
                                        "data-outside-range:text-gray-300 data-outside-range:pointer-events-none data-outside-range:bg-transparent!",
                                        "data-disabled:text-gray-300 data-disabled:pointer-events-none data-disabled:cursor-not-allowed",
                                        "data-unavailable:text-gray-300 data-unavailable:pointer-events-none data-unavailable:cursor-not-allowed data-unavailable:line-through",
                                        "hover:bg-gray-100",
                                        "data-in-range:bg-primary data-in-range:text-white",
                                        locale === "ar"
                                          ? "data-range-start:bg-primary data-range-start:text-white data-range-start:rounded-l-none! data-range-start:rounded-r-md data-range-start:hover:bg-primary/90"
                                          : "data-range-start:bg-primary data-range-start:text-white data-range-start:rounded-r-none! data-range-start:rounded-l-md data-range-start:hover:bg-primary/90",
                                        locale === "ar"
                                          ? "data-range-end:bg-primary data-range-end:text-white data-range-end:rounded-r-none! data-range-end:rounded-l-md data-range-end:hover:bg-primary/90"
                                          : "data-range-end:bg-primary data-range-end:text-white data-range-end:rounded-l-none! data-range-end:rounded-r-md data-range-end:hover:bg-primary/90",
                                        "data-selected:bg-primary data-selected:text-white data-selected:rounded-md data-selected:hover:bg-primary/90",
                                        "not-data-in-range:rounded-md",
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
                    <DatePicker.ViewControl className="flex items-center justify-between mb-4 px-3">
                      <DatePicker.PrevTrigger className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-700">
                        <ChevronLeftIcon className="w-4 h-4 rtl:rotate-180" />
                      </DatePicker.PrevTrigger>
                      <DatePicker.ViewTrigger className="text-base font-semibold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">
                        <DatePicker.RangeText />
                      </DatePicker.ViewTrigger>
                      <DatePicker.NextTrigger className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-700">
                        <ChevronRightIcon className="w-4 h-4 rtl:rotate-180" />
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
                                  <DatePicker.TableCellTrigger className="w-16 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-colors data-selected:bg-primary data-selected:text-white flex items-center justify-center font-medium">
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
                    <DatePicker.ViewControl className="flex items-center justify-between mb-4 px-3">
                      <DatePicker.PrevTrigger className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-700">
                        <ChevronLeftIcon className="w-4 h-4 rtl:rotate-180" />
                      </DatePicker.PrevTrigger>
                      <DatePicker.ViewTrigger className="text-base font-semibold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">
                        <DatePicker.RangeText />
                      </DatePicker.ViewTrigger>
                      <DatePicker.NextTrigger className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-700">
                        <ChevronRightIcon className="w-4 h-4 rtl:rotate-180" />
                      </DatePicker.NextTrigger>
                    </DatePicker.ViewControl>
                    <DatePicker.Table className="w-full border-separate border-spacing-y-0.5 px-3">
                      <DatePicker.TableBody>
                        {api.getYearsGrid({ columns: 4 }).map((years, id) => (
                          <DatePicker.TableRow key={id}>
                            {years.map((year, id) => (
                              <DatePicker.TableCell key={id} value={year.value}>
                                <DatePicker.TableCellTrigger className="w-16 h-10 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-colors data-selected:bg-primary data-selected:text-white flex items-center justify-center font-medium">
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

      {/* Footer */}
      <div className="flex flex-col items-end gap-1.5 px-2.5 py-2 border-t border-gray-100 sm:px-3 sm:py-2.5">
        <div className="min-w-0 flex-1 ">
          {footerLabel ? (
            <>
              <p className="text-[11px] sm:text-[12px] font-bold text-gray-900 truncate">
                {footerLabel}
              </p>
              <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 text-end">
                {t("allDatesLocalTime")}
              </p>
            </>
          ) : (
            <p className="text-[10px] sm:text-[11px] text-gray-400">
              {t("selectDateToContinue")}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!departureDate}
          className="rounded bg-primary px-3 py-1.5 sm:px-4 sm:py-2 
          text-[11px] sm:text-[12px] font-semibold text-white 
          transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {t("confirmDeparture")}
        </button>
      </div>
    </div>
  );
}

export default FlexibleDatePicker;
