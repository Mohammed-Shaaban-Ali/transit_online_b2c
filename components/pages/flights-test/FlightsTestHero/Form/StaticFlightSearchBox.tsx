"use client";

import { useEffect, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useRouter } from "@/i18n/navigation";
import TripOptionsRow from "./components/TripOptionsRow";
import CitySelectorPopover from "./components/CitySelectorPopover";
import PassengersPopover from "./components/PassengersPopover";
import ActionButtonsRow from "./components/ActionButtonsRow";
import { CabinClass, TripType } from "./types";
import FlightDatePicker from "@/components/shared/FlightSearchBox/FlightDatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DatePickerFormValues = {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  tripType: "roundTrip" | "oneWay";
  adults: number;
  children: number;
  infants: number;
  cabinClass: "ECONOMY" | "BUSINESS";
};

type Props = {
  className?: string;
  compactActions?: boolean;
  submitPath?: string;
  initialValues?: Partial<{
    fromValue: string;
    toValue: string;
    tripType: TripType;
    nonstop: boolean;
    departureDate: string;
    returnDate?: string;
    adults: number;
    children: number;
    infants: number;
    cabinClass: CabinClass;
  }>;
};

function StaticFlightSearchBox({
  className,
  compactActions = false,
  submitPath = "/flights-test/showfarefirst",
  initialValues,
}: Props) {
  const router = useRouter();
  const [tripType, setTripType] = useState<TripType>(initialValues?.tripType || "roundTrip");
  const [nonstop, setNonstop] = useState(initialValues?.nonstop ?? true);
  const [fromValue, setFromValue] = useState(initialValues?.fromValue || "");
  const [toValue, setToValue] = useState(initialValues?.toValue || "");
  const [passengersPopoverOpen, setPassengersPopoverOpen] = useState(false);
  const [adults, setAdults] = useState(initialValues?.adults ?? 2);
  const [children, setChildren] = useState(initialValues?.children ?? 2);
  const [infants, setInfants] = useState(initialValues?.infants ?? 1);
  const [cabinClass, setCabinClass] = useState<CabinClass>(initialValues?.cabinClass || "Economy");
  const [isSwapping, setIsSwapping] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const dateForm = useForm<DatePickerFormValues>({
    mode: "onChange",
    defaultValues: {
      fromAirport: "",
      toAirport: "",
      departureDate: initialValues?.departureDate || "",
      returnDate: initialValues?.returnDate || "",
      tripType: initialValues?.tripType === "roundTrip" ? "roundTrip" : "oneWay",
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: "ECONOMY",
    },
  });

  useEffect(() => {
    // Multi-city uses same date UI behavior as one-way in this test version.
    const mappedTripType = tripType === "roundTrip" ? "roundTrip" : "oneWay";
    dateForm.setValue("tripType", mappedTripType, { shouldValidate: false });
  }, [tripType, dateForm]);

  const handleSwapLocations = () => {
    setIsSwapping((prev) => !prev);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const validateForm = () => {
    if (!fromValue.trim() || !toValue.trim()) {
      setFormError("Please select both departure and destination.");
      return false;
    }
    if (fromValue.trim().toLowerCase() === toValue.trim().toLowerCase()) {
      setFormError("Departure and destination must be different.");
      return false;
    }
    if (!departureDate) {
      setFormError("Please select departure date.");
      return false;
    }
    if (mappedTripType === "roundTrip" && !returnDate) {
      setFormError("Please select return date.");
      return false;
    }
    if (adults < 1) {
      setFormError("At least one adult is required.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSearch = () => {
    if (!validateForm()) return;

    const params = new URLSearchParams();
    params.set("from", fromValue.trim());
    params.set("to", toValue.trim());
    params.set("tripType", tripType);
    params.set("nonstop", String(nonstop));
    params.set("departureDate", departureDate);
    if (returnDate) {
      params.set("returnDate", returnDate);
    }
    params.set("adults", String(adults));
    params.set("children", String(children));
    params.set("infants", String(infants));
    params.set("cabinClass", cabinClass);

    router.push(`${submitPath}?${params.toString()}`);
  };

  const departureDate = dateForm.watch("departureDate");
  const returnDate = dateForm.watch("returnDate");
  const mappedTripType = tripType === "roundTrip" ? "roundTrip" : "oneWay";

  const getDateTriggerLabel = () => {
    if (!departureDate) return "Select dates";
    const dep = format(new Date(departureDate), "MMM d");
    if (mappedTripType === "oneWay" || !returnDate) return dep;
    const ret = format(new Date(returnDate), "MMM d");
    return `${dep}-${ret}`;
  };

  return (
    <div className={cn("mt-3 w-full rounded-[8px] bg-white p-5", className)}>
      <TripOptionsRow
        tripType={tripType}
        nonstop={nonstop}
        onTripTypeChange={(nextTripType) => setTripType(nextTripType)}
        onNonstopChange={setNonstop}
      />

      <div className={cn(compactActions ? "flex items-center gap-2.5" : "grid grid-cols-12 gap-2.5")}>
        <div className={cn("relative", compactActions ? "flex-1" : "col-span-3")}>
          <CitySelectorPopover
            label="Leaving from"
            value={fromValue}
            onChange={setFromValue}
            panelWidthClassName="w-[480px]"
          />
        </div>

        <div className={cn("relative", compactActions ? "flex-1" : "col-span-3")}>
          <button
            type="button"
            onClick={handleSwapLocations}
            className="absolute -start-5 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center 
            justify-center rounded-full border border-gray-300 bg-white text-primary transition-colors hover:border-primary hover:text-primary/80 cursor-pointer"
          >
            <ArrowRightLeft
              size={18}
              className={`transition-transform duration-300 ${isSwapping ? "rotate-180" : "rotate-0"}`}
            />
          </button>
          <CitySelectorPopover
            label="Going to"
            value={toValue}
            onChange={setToValue}
            panelWidthClassName="w-[480px]"
            triggerClassName="ps-9"
          />
        </div>

        <div className={cn(compactActions ? "flex-1" : "col-span-3")}>
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-[58px] w-full items-center 
                rounded-sm border border-gray-300 px-3
                 text-[16px]  text-black"
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
              <FlightDatePicker
                form={dateForm}
                openCalendarByDefault
                calendarOnly
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className={cn(compactActions ? "flex-1" : "col-span-3")}>
          <PassengersPopover
            open={passengersPopoverOpen}
            onOpenChange={setPassengersPopoverOpen}
            adults={adults}
            children={children}
            infants={infants}
            cabinClass={cabinClass}
            onAdultsChange={setAdults}
            onChildrenChange={setChildren}
            onInfantsChange={setInfants}
            onCabinClassChange={setCabinClass}
          />
        </div>

        {compactActions && (
          <div className="shrink-0 flex items-center justify-end">
            <ActionButtonsRow compact className="mt-0" onSearch={handleSearch} />
          </div>
        )}
      </div>

      {formError && (
        <p className="mt-2 text-sm font-medium text-red-500">{formError}</p>
      )}

      {!compactActions && <ActionButtonsRow onSearch={handleSearch} />}
    </div>
  );
}

export default StaticFlightSearchBox;
