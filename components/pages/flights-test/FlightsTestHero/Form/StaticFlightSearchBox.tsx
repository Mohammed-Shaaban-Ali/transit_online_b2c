"use client";

import { useEffect, useState } from "react";
import { ArrowRightLeft, ArrowUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { useRouter } from "@/i18n/navigation";
import { formatDateToString } from "@/utils/formatDateToString";
import TripOptionsRow from "./components/TripOptionsRow";
import CitySelectorPopover from "./components/CitySelectorPopover";
import PassengersPopover from "./components/PassengersPopover";
import MobilePassengersSheet from "./components/MobilePassengersSheet";
import ActionButtonsRow from "./components/ActionButtonsRow";
import { FlightSearchFormValues, TripType } from "./types";
import FlexibleDatePicker from "./components/FlexibleDatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MdCalendarMonth } from "react-icons/md";
import { useTranslations } from "next-intl";

function buildFlightSearchSchema(
  v: ReturnType<typeof useTranslations<"FlightsTestForm.Validation">>,
) {
  return z
    .object({
      fromAirport: z.string().min(1, { message: v("selectDepartureAirport") }),
      toAirport: z.string().min(1, { message: v("selectDestinationAirport") }),
      departureDate: z.string().min(1, { message: v("selectDepartureDate") }),
      returnDate: z.string().optional(),
      tripType: z.enum(["roundTrip", "oneWay"]),
      nonstop: z.boolean(),
      adults: z.number().min(1),
      children: z.number().min(0),
      infants: z.number().min(0),
      cabinClass: z.enum(["ECONOMY", "BUSINESS"]),
    })
    .refine(
      (data) => {
        if (data.departureDate) {
          const today = new Date(new Date().setHours(0, 0, 0, 0));
          const departure = new Date(data.departureDate);
          departure.setHours(0, 0, 0, 0);
          return departure >= today;
        }
        return true;
      },
      { message: v("departureDatePast"), path: ["departureDate"] },
    )
    .refine(
      (data) => {
        if (data.tripType === "roundTrip" && !data.returnDate) return false;
        return true;
      },
      { message: v("selectReturnDate"), path: ["returnDate"] },
    )
    .refine(
      (data) => {
        if (
          data.tripType === "roundTrip" &&
          data.returnDate &&
          data.departureDate
        ) {
          const dep = new Date(data.departureDate);
          dep.setHours(0, 0, 0, 0);
          const ret = new Date(data.returnDate);
          ret.setHours(0, 0, 0, 0);
          return ret >= dep;
        }
        return true;
      },
      { message: v("returnDateAfter"), path: ["returnDate"] },
    )
    .refine(
      (data) => {
        if (data.fromAirport && data.toAirport)
          return data.fromAirport !== data.toAirport;
        return true;
      },
      { message: v("differentAirports"), path: ["toAirport"] },
    )
    .refine(
      (data) => {
        if (data.fromAirport && data.toAirport)
          return data.fromAirport !== data.toAirport;
        return true;
      },
      { message: v("differentAirports"), path: ["fromAirport"] },
    );
}

type Props = {
  className?: string;
  compactActions?: boolean;
  submitPath?: string;
  initialValues?: Partial<{
    fromAirport: string;
    toAirport: string;
    fromDisplayValue: string;
    toDisplayValue: string;
    tripType: TripType;
    nonstop: boolean;
    departureDate: string;
    returnDate?: string;
    adults: number;
    children: number;
    infants: number;
    cabinClass: "ECONOMY" | "BUSINESS";
  }>;
};

function StaticFlightSearchBox({
  className,
  compactActions = false,
  submitPath = "/flights/showfarefirst",
  initialValues,
}: Props) {
  const router = useRouter();
  const t = useTranslations("FlightsTestForm");
  const v = useTranslations("FlightsTestForm.Validation");
  const flightSearchSchema = buildFlightSearchSchema(v);

  const [tripType, setTripType] = useState<TripType>(
    initialValues?.tripType || "roundTrip",
  );
  const [nonstop, setNonstop] = useState(initialValues?.nonstop ?? true);
  const [fromDisplayValue, setFromDisplayValue] = useState(
    initialValues?.fromDisplayValue || "",
  );
  const [toDisplayValue, setToDisplayValue] = useState(
    initialValues?.toDisplayValue || "",
  );
  const [passengersPopoverOpen, setPassengersPopoverOpen] = useState(false);
  const [mobileSheet, setMobileSheet] = useState<"passengers" | "cabin" | null>(
    null,
  );
  const [isSwapping, setIsSwapping] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [datePopoverOpenMobile, setDatePopoverOpenMobile] = useState(false);

  const form = useForm<FlightSearchFormValues>({
    resolver: zodResolver(flightSearchSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      fromAirport: initialValues?.fromAirport || "",
      toAirport: initialValues?.toAirport || "",
      departureDate: initialValues?.departureDate || "",
      returnDate: initialValues?.returnDate || "",
      tripType:
        initialValues?.tripType === "roundTrip" ? "roundTrip" : "oneWay",
      nonstop: initialValues?.nonstop ?? true,
      adults: initialValues?.adults ?? 1,
      children: initialValues?.children ?? 0,
      infants: initialValues?.infants ?? 0,
      cabinClass: initialValues?.cabinClass || "ECONOMY",
    },
  });

  const {
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!initialValues) return;
    form.reset({
      fromAirport: initialValues.fromAirport || "",
      toAirport: initialValues.toAirport || "",
      departureDate: initialValues.departureDate || "",
      returnDate: initialValues.returnDate || "",
      tripType: initialValues.tripType === "roundTrip" ? "roundTrip" : "oneWay",
      nonstop: initialValues.nonstop ?? true,
      adults: initialValues.adults ?? 1,
      children: initialValues.children ?? 0,
      infants: initialValues.infants ?? 0,
      cabinClass: initialValues.cabinClass || "ECONOMY",
    });
    setTripType(initialValues.tripType || "roundTrip");
    setNonstop(initialValues.nonstop ?? true);
  }, [
    initialValues?.fromAirport,
    initialValues?.toAirport,
    initialValues?.departureDate,
    initialValues?.returnDate,
    initialValues?.tripType,
    initialValues?.nonstop,
    initialValues?.adults,
    initialValues?.children,
    initialValues?.infants,
    initialValues?.cabinClass,
  ]);

  useEffect(() => {
    const mappedTripType = tripType === "roundTrip" ? "roundTrip" : "oneWay";
    form.setValue("tripType", mappedTripType, { shouldValidate: false });
  }, [tripType, form]);

  useEffect(() => {
    form.setValue("nonstop", nonstop, { shouldValidate: false });
  }, [nonstop, form]);

  const handleSwapLocations = () => {
    setIsSwapping((prev) => !prev);

    const currentFrom = form.getValues("fromAirport");
    const currentTo = form.getValues("toAirport");
    const currentFromDisplay = fromDisplayValue;
    const currentToDisplay = toDisplayValue;

    form.setValue("fromAirport", currentTo, { shouldValidate: true });
    form.setValue("toAirport", currentFrom, { shouldValidate: true });
    setFromDisplayValue(currentToDisplay);
    setToDisplayValue(currentFromDisplay);
  };

  const departureDate = form.watch("departureDate");
  const returnDate = form.watch("returnDate");
  const mappedTripType = tripType === "roundTrip" ? "roundTrip" : "oneWay";

  const getDateTriggerLabel = () => {
    if (!departureDate) return t("selectDates");
    const dep = format(new Date(departureDate), "MMM d");
    if (mappedTripType === "oneWay" || !returnDate) return dep;
    const ret = format(new Date(returnDate), "MMM d");
    return `${dep} - ${ret}`;
  };

  const fromAirportError = errors.fromAirport?.message;
  const toAirportError = errors.toAirport?.message;
  const departureDateError = errors.departureDate?.message;
  const returnDateError = errors.returnDate?.message;

  const handleSearch = () => {
    form.handleSubmit((data) => {
      const formattedData = {
        ...data,
        departureDate: formatDateToString(data.departureDate),
        returnDate: data.returnDate
          ? formatDateToString(data.returnDate)
          : undefined,
      };

      const params = new URLSearchParams();
      params.set("from", formattedData.fromAirport);
      params.set("to", formattedData.toAirport);
      params.set("tripType", tripType);
      params.set("nonstop", String(nonstop));
      params.set("departureDate", formattedData.departureDate);
      if (formattedData.returnDate && formattedData.tripType === "roundTrip") {
        params.set("returnDate", formattedData.returnDate);
      }
      params.set("adults", String(formattedData.adults));
      if (formattedData.children > 0) {
        params.set("children", String(formattedData.children));
      }
      if (formattedData.infants > 0) {
        params.set("infants", String(formattedData.infants));
      }
      params.set("cabinClass", formattedData.cabinClass);

      router.push(`${submitPath}?${params.toString()}`);
    })();
  };

  return (
    <div
      className={cn(
        "mt-0 md:mt-3 w-full rounded-[8px] bg-white p-3 pt-2 md:p-5",
        className,
      )}
    >
      <TripOptionsRow
        tripType={tripType}
        nonstop={nonstop}
        onTripTypeChange={(nextTripType) => setTripType(nextTripType)}
        onNonstopChange={setNonstop}
      />

      {/* Mobile layout */}
      <div className="flex flex-col md:hidden">
        {/* From */}
        <div className="relative border-b border-gray-200">
          <CitySelectorPopover
            label={t("leavingFrom")}
            fieldName="fromAirport"
            form={form}
            displayValue={fromDisplayValue}
            onDisplayValueChange={setFromDisplayValue}
            panelWidthClassName="w-[calc(100vw-40px)]"
            error={fromAirportError}
            mobileStyle
          />
          <button
            type="button"
            onClick={handleSwapLocations}
            className="absolute end-0 -bottom-[18px] z-20 flex
             h-10 w-10 items-center justify-center rounded-md 
             border border-gray-300 bg-white text-gray-600 
             transition-colors hover:border-primary hover:text-primary 
             cursor-pointer
             
             before:content-[''] before:absolute 
             before:-start-[11px] before:top-0 before:h-10 
             before:w-2.5 before:bg-white
           
             "
          >
            <ArrowUpDown
              size={16}
              className={`transition-transform duration-300 ${isSwapping ? "rotate-180" : "rotate-0"}`}
            />
          </button>
        </div>

        {/* To */}
        <div className="relative border-b border-gray-200">
          <CitySelectorPopover
            label={t("goingTo")}
            fieldName="toAirport"
            form={form}
            displayValue={toDisplayValue}
            onDisplayValueChange={setToDisplayValue}
            panelWidthClassName="w-[calc(100vw-40px)]"
            error={toAirportError}
            mobileStyle
          />
        </div>

        {/* Date */}
        <div className="border-b border-gray-200">
          <Popover
            open={datePopoverOpenMobile}
            onOpenChange={setDatePopoverOpenMobile}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-[54px] w-full items-center gap-2.5 text-[15px] text-black"
              >
                <MdCalendarMonth size={18} />
                <span
                  className={departureDate ? "text-black" : "text-gray-500"}
                >
                  {getDateTriggerLabel()}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={8}
              avoidCollisions={false}
              collisionPadding={0}
              sticky="always"
              hideWhenDetached={false}
              className="w-auto max-w-[calc(100vw-32px)] overflow-x-auto border-none bg-transparent p-0 shadow-none"
            >
              <FlexibleDatePicker
                form={form as any}
                onConfirm={() => setDatePopoverOpenMobile(false)}
              />
            </PopoverContent>
          </Popover>
          {departureDateError && (
            <p className="px-4 pb-2 text-xs text-red-500 font-medium">
              {departureDateError}
            </p>
          )}
          {returnDateError && !departureDateError && (
            <p className="px-4 pb-2 text-xs text-red-500 font-medium">
              {returnDateError}
            </p>
          )}
        </div>

        {/* Passengers + Cabin - bottom sheet */}
        <MobilePassengersSheet
          form={form}
          openSheet={mobileSheet}
          onOpenSheet={setMobileSheet}
        />

        {/* Search button */}
        <button
          type="button"
          onClick={handleSearch}
          className="mt-3 h-[48px] w-full rounded-lg bg-primary text-[16px] font-semibold text-white transition-colors hover:bg-primary/80"
        >
          {t("search")}
        </button>
      </div>

      {/* Desktop layout */}
      <div
        className={cn(
          "hidden",
          compactActions
            ? "md:flex md:items-center md:gap-2.5"
            : "md:grid md:grid-cols-12 md:gap-2.5",
        )}
      >
        <div
          className={cn("relative", compactActions ? "flex-1" : "col-span-3")}
        >
          <CitySelectorPopover
            label={t("leavingFrom")}
            fieldName="fromAirport"
            form={form}
            displayValue={fromDisplayValue}
            onDisplayValueChange={setFromDisplayValue}
            panelWidthClassName="w-[480px]"
            error={fromAirportError}
          />
        </div>

        <div
          className={cn("relative", compactActions ? "flex-1" : "col-span-3")}
        >
          <button
            type="button"
            onClick={handleSwapLocations}
            className="absolute -start-5 top-[29px] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-primary transition-colors hover:border-primary hover:text-primary/80 cursor-pointer"
          >
            <ArrowRightLeft
              size={18}
              className={`transition-transform duration-300 ${isSwapping ? "rotate-180" : "rotate-0"}`}
            />
          </button>
          <CitySelectorPopover
            label={t("goingTo")}
            fieldName="toAirport"
            form={form}
            displayValue={toDisplayValue}
            onDisplayValueChange={setToDisplayValue}
            panelWidthClassName="w-[480px]"
            triggerClassName="ps-9"
            error={toAirportError}
          />
        </div>

        <div className={cn(compactActions ? "flex-1" : "col-span-3")}>
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-[58px] w-full items-center rounded-sm border border-gray-300 px-3 text-[16px] text-black"
              >
                {getDateTriggerLabel()}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              side="bottom"
              sideOffset={6}
              className="w-auto border-none bg-transparent p-0 shadow-none"
            >
              <FlexibleDatePicker
                form={form as any}
                onConfirm={() => setDatePopoverOpen(false)}
              />
            </PopoverContent>
          </Popover>
          {departureDateError && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {departureDateError}
            </p>
          )}
          {returnDateError && !departureDateError && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {returnDateError}
            </p>
          )}
        </div>

        <div className={cn(compactActions ? "flex-1" : "col-span-3")}>
          <PassengersPopover
            form={form}
            open={passengersPopoverOpen}
            onOpenChange={setPassengersPopoverOpen}
          />
        </div>

        {compactActions && (
          <div className="shrink-0 flex items-center justify-end">
            <ActionButtonsRow
              compact
              className="mt-0"
              onSearch={handleSearch}
            />
          </div>
        )}
      </div>

      {!compactActions && (
        <ActionButtonsRow onSearch={handleSearch} className="hidden md:flex" />
      )}
    </div>
  );
}

export default StaticFlightSearchBox;
