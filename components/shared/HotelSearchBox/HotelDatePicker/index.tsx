"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { searchHotelsParams } from "..";
import { FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import { DatePicker, parseDate } from "@ark-ui/react/date-picker";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ar, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";

type Props = {
  form: UseFormReturn<searchHotelsParams & { searchValue?: string }>;
};

function HotelDatePicker({ form }: Props) {
  const t = useTranslations("Components.HotelSearchBox");
  const locale = useLocale();
  const [isFocused, setIsFocused] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { watch, setValue, formState, clearErrors, trigger } = form;
  const checkInValue = watch("checkIn");
  const checkOutValue = watch("checkOut");
  const checkInError = formState.errors.checkIn?.message as string | undefined;
  const checkOutError = formState.errors.checkOut?.message as string | undefined;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Set default dates if no values exist
  useEffect(() => {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (!checkInValue || checkInValue === "") {
      setValue("checkIn", format(today, "yyyy-MM-dd"), {
        shouldValidate: false,
      });
    }
    if (!checkOutValue || checkOutValue === "") {
      const checkIn = checkInValue ? new Date(checkInValue) : today;
      const nextDay = new Date(checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setValue("checkOut", format(nextDay, "yyyy-MM-dd"), {
        shouldValidate: false,
      });
    }
  }, [checkInValue, checkOutValue, setValue]);

  // Format date for display
  const formatDateForDisplay = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, "MMM d", { locale: locale === "ar" ? ar : enUS });
  };

  // Get display value
  const getDisplayValue = () => {
    if (checkInValue && checkOutValue) {
      return `${formatDateForDisplay(new Date(checkInValue))} - ${formatDateForDisplay(new Date(checkOutValue))}`;
    } else if (checkInValue) {
      return `${formatDateForDisplay(new Date(checkInValue))} - ${t("CheckOut.label")}`;
    }
    return "";
  };

  // Handle date value change from Ark UI DatePicker
  const handleDateChange = (details: { value: { toString: () => string }[], valueAsString: string[] }) => {
    if (details.value.length >= 1) {
      const startDate = new Date(details.value[0].toString());
      setValue("checkIn", format(startDate, "yyyy-MM-dd"), { shouldValidate: true });
      // Clear error immediately after selecting a valid date
      clearErrors("checkIn");
      trigger("checkIn");
    }
    if (details.value.length >= 2) {
      const endDate = new Date(details.value[1].toString());
      setValue("checkOut", format(endDate, "yyyy-MM-dd"), { shouldValidate: true });
      // Clear error immediately after selecting a valid date
      clearErrors("checkOut");
      trigger("checkOut");
    } else {
      // If only one date selected, clear checkout
      if (details.value.length === 1) {
        setValue("checkOut", "", { shouldValidate: false });
      }
    }
  };

  // Get default value for DatePicker
  const getDefaultValue = useMemo(() => {
    const values = [];
    if (checkInValue) {
      values.push(parseDate(new Date(checkInValue)));
    }
    if (checkOutValue) {
      values.push(parseDate(new Date(checkOutValue)));
    }
    if (values.length === 0) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      values.push(parseDate(today));
      values.push(parseDate(tomorrow));
    }
    return values;
  }, [checkInValue, checkOutValue]);

  const displayValue = getDisplayValue();
  const hasValue = displayValue && displayValue.length > 0;
  const isActive = isFocused || hasValue || showCalendar;

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
        setIsFocused(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const numOfMonths = isMobile ? 1 : 2;

  return (
    <div className="col-span-1  relative md:border-s-2 border-gray-200" ref={containerRef}>
      <div className="relative flex w-full items-center px-4 h-16 bg-transparent transition-all duration-300">
        <label
          htmlFor="hotelDate"
          className={`absolute transition-all font-bold duration-200 pointer-events-none ${isActive
            ? "-top-0.5 text-gray-500"
            : "top-1/2 -translate-y-1/2 text-gray-500"
            }`}
        >
          {t("CheckIn.label")} - {t("CheckOut.label")}
        </label>

        <div className="flex items-center gap-1 relative w-full">
          <FaCalendarAlt
            size={18}
            className={`absolute top-[19px] start-0 ${isActive ? "text-gray-400" : "text-transparent"
              }`}
          />
          <div
            className={`w-full font-bold text-nowrap text-black bg-transparent border-none outline-none p-0 cursor-pointer ${isActive ? "mt-4 ps-6" : ""
              }`}
            onClick={() => {
              setShowCalendar(true);
              setIsFocused(true);
            }}
          >
            {displayValue || ""}
          </div>
        </div>

        {/* Calendar popup */}
        {showCalendar && (
          <div
            className={cn(
              "absolute top-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0",
              "bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden",
              "max-w-[680px]"
            )}
          >
            <div className="flex flex-col">
              {/* Calendar */}
              <div className="flex w-full justify-center p-3">
                <DatePicker.Root
                  key={`hotel-date-${numOfMonths}`}
                  inline
                  defaultValue={getDefaultValue}
                  selectionMode="range"
                  timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
                  numOfMonths={numOfMonths}
                  locale={locale}
                  onValueChange={handleDateChange}
                  isDateUnavailable={(date) => {
                    const today = new Date(new Date().setHours(0, 0, 0, 0));
                    const checkDate = date.toDate("UTC");
                    return checkDate < today;
                  }}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  <DatePicker.Content className="bg-white inline-block">
                    <DatePicker.View
                      view="day"
                      className={cn(
                        "flex relative",
                        numOfMonths > 1 && "divide-x divide-gray-200 rtl:divide-x-reverse"
                      )}
                    >
                      <nav className="absolute w-full top-0 flex justify-between px-3 z-10">
                        <DatePicker.PrevTrigger className="p-2.5 hover:bg-gray-100 rounded-md transition-colors text-gray-700">
                          <ChevronLeftIcon className="w-4 h-4" />
                        </DatePicker.PrevTrigger>
                        <DatePicker.NextTrigger className="p-2.5 hover:bg-gray-100 rounded-md transition-colors text-gray-700">
                          <ChevronRightIcon className="w-4 h-4" />
                        </DatePicker.NextTrigger>
                      </nav>
                      <DatePicker.Context>
                        {(api) =>
                          Array.from({ length: numOfMonths }).map((_, index) => {
                            const offset = api.getOffset({ months: index });
                            return (
                              <div key={index} className="px-3">
                                <DatePicker.ViewControl className="flex justify-center items-center mx-10 mb-1 h-9">
                                  <DatePicker.ViewTrigger className="z-20 text-sm font-medium text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">
                                    <span>
                                      {new Intl.DateTimeFormat(locale, {
                                        month: "long",
                                      }).format(
                                        offset.visibleRange.start.toDate("UTC")
                                      )}{" "}
                                      {offset.visibleRange.start.year}
                                    </span>
                                  </DatePicker.ViewTrigger>
                                </DatePicker.ViewControl>
                                <DatePicker.Table>
                                  <DatePicker.TableHead>
                                    <DatePicker.TableRow>
                                      {api.weekDays.map((weekDay, id) => (
                                        <DatePicker.TableHeader
                                          key={id}
                                          className="text-sm font-medium text-gray-500 w-9 h-7 text-center"
                                        >
                                          {weekDay.narrow}
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
                                                "relative w-9 h-9 text-sm transition-colors flex items-center justify-center font-medium cursor-pointer",
                                                // Today indicator
                                                "data-today:after:content-[''] data-today:after:absolute data-today:after:bottom-0.5 data-today:after:w-1 data-today:after:h-1 data-today:after:rounded-full data-today:after:bg-primary",
                                                // Outside range (other months)
                                                "data-outside-range:text-gray-300 data-outside-range:pointer-events-none",
                                                // Disabled dates
                                                "data-disabled:text-gray-300 data-disabled:pointer-events-none data-disabled:cursor-not-allowed",
                                                "data-unavailable:text-gray-300 data-unavailable:pointer-events-none data-unavailable:cursor-not-allowed data-unavailable:line-through",
                                                // Hover state
                                                "hover:bg-gray-100",
                                                // In range (between start and end)
                                                "data-in-range:bg-primary/10",
                                                // Range start
                                                "data-range-start:bg-primary data-range-start:text-white data-range-start:rounded-e-none! data-range-start:rounded-s-lg data-range-start:hover:bg-primary/90",
                                                // Range end
                                                "data-range-end:bg-primary data-range-end:text-white data-range-end:rounded-s-none! data-range-end:rounded-e-lg data-range-end:hover:bg-primary/90",
                                                // Selected (single mode)
                                                "data-selected:bg-primary data-selected:text-white data-selected:rounded-lg data-selected:hover:bg-primary/90",
                                                // Not in range - rounded
                                                "not-data-in-range:rounded-lg",
                                                // Today when selected
                                                "data-selected:data-today:after:bg-white",
                                                "data-range-start:data-today:after:bg-white",
                                                "data-range-end:data-today:after:bg-white"
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
                    {/* Month View */}
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
                    {/* Year View */}
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
                                      <DatePicker.TableCell
                                        key={id}
                                        value={year.value}
                                      >
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
            </div>
          </div>
        )}
      </div>

      {/* Error messages */}
      {(checkInError || checkOutError) && (
        <p title={checkInError || checkOutError} className="absolute -bottom-1.5 start-4 text-xs text-red-500 font-medium line-clamp-1">
          {checkInError || checkOutError}
        </p>
      )}
    </div>
  );
}

export default HotelDatePicker;
