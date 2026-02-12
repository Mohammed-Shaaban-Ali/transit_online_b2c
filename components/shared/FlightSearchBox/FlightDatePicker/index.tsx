"use client";

import React, { useState, useRef, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import { DatePicker, parseDate } from "@ark-ui/react/date-picker";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { ar, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface FlightSearchParams {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  tripType: "roundTrip" | "oneWay";
  adults: number;
  children: number;
  infants: number;
  cabinClass: "ECONOMY" | "BUSINESS";
}

type Props = {
  form: UseFormReturn<FlightSearchParams>;
};

function FlightDatePicker({ form }: Props) {
  const t = useTranslations("Components.FlightSearchBox.FlightDatePicker");
  const locale = useLocale();
  const [isFocused, setIsFocused] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { watch, setValue, formState, clearErrors, trigger } = form;
  const tripType = watch("tripType");
  const departureDate = watch("departureDate");
  const returnDate = watch("returnDate");
  const departureDateError = formState.errors.departureDate?.message as
    | string
    | undefined;
  const returnDateError = formState.errors.returnDate?.message as
    | string
    | undefined;

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

    if (tripType === "roundTrip") {
      if (!departureDate || departureDate === "") {
        setValue("departureDate", format(today, "yyyy-MM-dd"), {
          shouldValidate: false,
        });
        setValue("returnDate", format(tomorrow, "yyyy-MM-dd"), {
          shouldValidate: false,
        });
      } else if (!returnDate || returnDate === "") {
        const from = new Date(departureDate);
        const to = tomorrow > from ? tomorrow : new Date(from);
        to.setDate(to.getDate() + 1);
        setValue("returnDate", format(to, "yyyy-MM-dd"), {
          shouldValidate: false,
        });
      }
    } else {
      if (!departureDate || departureDate === "") {
        setValue("departureDate", format(today, "yyyy-MM-dd"), {
          shouldValidate: false,
        });
      }
    }
  }, [tripType, departureDate, returnDate, setValue]);

  // Format date for display
  const formatDateForDisplay = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, "MMM d", { locale: locale === "ar" ? ar : enUS });
  };

  // Get display value
  const getDisplayValue = () => {
    if (tripType === "roundTrip") {
      if (departureDate && returnDate) {
        return `${formatDateForDisplay(new Date(departureDate))} - ${formatDateForDisplay(new Date(returnDate))}`;
      } else if (departureDate) {
        return `${formatDateForDisplay(new Date(departureDate))} - ${t("selectReturn")}`;
      }
      return "";
    } else {
      return departureDate ? formatDateForDisplay(new Date(departureDate)) : "";
    }
  };

  const handleTripTypeChange = (type: "roundTrip" | "oneWay") => {
    setValue("tripType", type);
    if (type === "oneWay") {
      setValue("returnDate", undefined);
    }
  };

  // Handle date value change from Ark UI DatePicker
  const handleDateChange = (details: { value: { toString: () => string }[], valueAsString: string[] }) => {
    if (tripType === "roundTrip") {
      if (details.value.length >= 1) {
        const startDate = new Date(details.value[0].toString());
        setValue("departureDate", format(startDate, "yyyy-MM-dd"));
        // Clear error immediately after selecting a valid date
        clearErrors("departureDate");
        trigger("departureDate");
      }
      if (details.value.length >= 2) {
        const endDate = new Date(details.value[1].toString());
        setValue("returnDate", format(endDate, "yyyy-MM-dd"));
        // Clear error immediately after selecting a valid date
        clearErrors("returnDate");
        trigger("returnDate");
      } else {
        setValue("returnDate", undefined);
      }
    } else {
      if (details.value.length >= 1) {
        const date = new Date(details.value[0].toString());
        setValue("departureDate", format(date, "yyyy-MM-dd"));
        // Clear error immediately after selecting a valid date
        clearErrors("departureDate");
        trigger("departureDate");
      }
    }
  };

  // Get default value for DatePicker
  const getDefaultValue = () => {
    if (tripType === "roundTrip") {
      const values = [];
      if (departureDate) {
        values.push(parseDate(new Date(departureDate)));
      }
      if (returnDate) {
        values.push(parseDate(new Date(returnDate)));
      }
      return values.length > 0 ? values : [parseDate(new Date())];
    } else {
      return departureDate ? [parseDate(new Date(departureDate))] : [parseDate(new Date())];
    }
  };

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

  // One way = always 1 month, Round trip = 1 month on mobile, 2 months on desktop
  const numOfMonths = tripType === "oneWay" ? 1 : (isMobile ? 1 : 2);

  return (
    <div className="col-span-1 relative w-full" ref={containerRef}>
      <div className="relative flex w-full items-center px-4 h-16 bg-transparent transition-all duration-300">
        <label
          htmlFor="flightDate"
          className={`absolute transition-all font-bold duration-200 pointer-events-none ${isActive
            ? "-top-0.5 text-gray-500"
            : "top-1/2 -translate-y-1/2 text-gray-500"
            }`}
        >
          {tripType === "roundTrip" ? t("departureReturn") : t("departure")}
        </label>

        <div className="flex items-center gap-1 relative w-full">
          <FaCalendarAlt
            size={18}
            className={`absolute top-[19px] start-0 ${isActive ? "text-gray-400" : "text-transparent"
              }`}
          />
          <div
            className={`w-full font-bold text-nowrap text-black bg-transparent border-none outline-none p-0 cursor-pointer ${isActive ? "mt-4 ps-6 pe-32" : ""
              }`}
            onClick={() => {
              setShowCalendar(true);
              setIsFocused(true);
            }}
          >
            {displayValue || (isActive ? t("selectDates") : "")}
          </div>
        </div>

        {/* Calendar popup */}
        {showCalendar && (
          <div
            className={cn(
              "absolute top-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 ",
              "bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden",
              tripType === "oneWay" ? "max-w-[360px]" : "max-w-[680px]"
            )}
          >
            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 
              sm:gap-0 px-4  py-3 border-b border-gray-200 bg-gray-50">
                {/* Trip type selector */}
                <div className="flex w-full gap-4 sm:gap-5">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="tripTypeCalendar"
                      checked={tripType === "roundTrip"}
                      onChange={() => handleTripTypeChange("roundTrip")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-nowrap" >
                      {t("roundTrip")}
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="tripTypeCalendar"
                      checked={tripType === "oneWay"}
                      onChange={() => handleTripTypeChange("oneWay")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-nowrap">{t("oneWay")}</span>
                  </label>
                </div>
                <Button
                  type="button"
                  className="rounded-full w-full sm:w-auto ms-4"
                  onClick={() => {
                    setShowCalendar(false);
                    setIsFocused(false);
                  }}
                >
                  {t("done")}
                </Button>
              </div>

              {/* Calendar */}
              <div className="flex w-full justify-center p-3">
                <DatePicker.Root
                  key={`${tripType}-${numOfMonths}`}
                  inline
                  defaultValue={getDefaultValue()}
                  selectionMode={tripType === "roundTrip" ? "range" : "single"}
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
                          <ChevronLeftIcon className="w-4 h-4 " />
                        </DatePicker.PrevTrigger>
                        <DatePicker.NextTrigger className="p-2.5 hover:bg-gray-100 rounded-md transition-colors text-gray-700">
                          <ChevronRightIcon className="w-4 h-4 " />
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
      {departureDateError && (
        <p title={departureDateError} className="absolute -bottom-1.5 start-4 text-xs  text-red-500 font-medium line-clamp-1">
          {departureDateError}
        </p>
      )}
      {returnDateError && (
        <p title={returnDateError} className="absolute -bottom-1.5 start-4 text-xs text-red-500 font-medium line-clamp-1">
          {returnDateError}
        </p>
      )}
    </div>
  );
}

export default FlightDatePicker;
