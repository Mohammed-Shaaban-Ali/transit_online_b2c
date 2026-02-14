"use client";

import { useForm } from "react-hook-form";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import FromAirport, { FromAirportRef } from "./FromAirport";
import ToAirport, { ToAirportRef } from "./ToAirport";
import FlightPassenger from "./FlightPassenger";
import FlightDatePicker from "./FlightDatePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatDateToString } from "@/utils/formatDateToString";
import { localStorageFlightSearchKey } from "@/constants";

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
  defaultValues?: FlightSearchParams & {
    fromAirportDisplay?: string;
    toAirportDisplay?: string;
    fromAirportCity?: string;
    toAirportCity?: string;
  };
  isLoading?: boolean;
};

const createFlightSearchFormSchema = (t: (key: string) => string) =>
  z
    .object({
      fromAirport: z
        .string()
        .min(1, { message: t("validation.fromAirportRequired") }),
      toAirport: z
        .string()
        .min(1, { message: t("validation.toAirportRequired") }),
      departureDate: z
        .string()
        .min(1, { message: t("validation.departureDateRequired") }),
      returnDate: z.string().optional(),
      tripType: z.enum(["roundTrip", "oneWay"]),
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
      {
        message: t("validation.departureDatePast"),
        path: ["departureDate"],
      }
    )
    .refine(
      (data) => {
        if (data.tripType === "roundTrip" && !data.returnDate) {
          return false;
        }
        return true;
      },
      {
        message: t("validation.returnDateRequired"),
        path: ["returnDate"],
      }
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
          return ret >= dep; // allow same day (ذهاب وعودة في نفس اليوم)
        }
        return true;
      },
      {
        message: t("validation.returnDateAfter"),
        path: ["returnDate"],
      }
    )
    .refine(
      (data) => {
        if (data.fromAirport && data.toAirport) {
          return data.fromAirport !== data.toAirport;
        }
        return true;
      },
      {
        message: t("validation.airportsMustBeDifferent"),
        path: ["toAirport"],
      }
    )
    .refine(
      (data) => {
        if (data.fromAirport && data.toAirport) {
          return data.fromAirport !== data.toAirport;
        }
        return true;
      },
      {
        message: t("validation.airportsMustBeDifferent"),
        path: ["fromAirport"],
      }
    );

// Get last search from localStorage
const getLastSearchFromStorage = ():
  | (FlightSearchParams & {
    fromAirportDisplay?: string;
    toAirportDisplay?: string;
    fromAirportCity?: string;
    toAirportCity?: string;
  })
  | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const storedSearch = localStorage.getItem(localStorageFlightSearchKey);
    if (storedSearch) {
      const parsed = JSON.parse(storedSearch);
      // Validate that it has required fields
      if (parsed.fromAirport && parsed.toAirport && parsed.departureDate) {
        return parsed as FlightSearchParams & {
          fromAirportDisplay?: string;
          toAirportDisplay?: string;
          fromAirportCity?: string;
          toAirportCity?: string;
        };
      }
    }
  } catch (error) {
    console.error("Error reading last search from localStorage:", error);
  }
  return null;
};

const FlightSearchBox = ({ defaultValues, isLoading = false }: Props) => {
  const Router = useRouter();
  const t = useTranslations("Components.FlightSearchBox");

  // Get last search from localStorage if no defaultValues provided
  const lastSearch = useMemo(() => {
    if (defaultValues) return null;
    return getLastSearchFromStorage();
  }, [defaultValues]);

  // Determine if we have default values (from props or last search)
  const hasDefaultValues = !!(defaultValues || lastSearch);

  const flightSearchFormSchema = createFlightSearchFormSchema(t);

  const form = useForm<FlightSearchParams>({
    resolver: zodResolver(flightSearchFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: defaultValues
      ? {
        fromAirport: defaultValues.fromAirport || "",
        toAirport: defaultValues.toAirport || "",
        departureDate: defaultValues.departureDate || "",
        returnDate: defaultValues.returnDate || "",
        tripType: defaultValues.tripType || "roundTrip",
        adults: defaultValues.adults ?? 1,
        children: defaultValues.children ?? 0,
        infants: defaultValues.infants ?? 0,
        cabinClass: defaultValues.cabinClass || "ECONOMY",
      }
      : lastSearch
        ? {
          fromAirport: lastSearch.fromAirport || "",
          toAirport: lastSearch.toAirport || "",
          departureDate: lastSearch.departureDate || "",
          returnDate: lastSearch.returnDate || "",
          tripType: lastSearch.tripType || "roundTrip",
          adults: lastSearch.adults ?? 1,
          children: lastSearch.children ?? 0,
          infants: lastSearch.infants ?? 0,
          cabinClass: lastSearch.cabinClass || "ECONOMY",
        }
        : {
          fromAirport: "",
          toAirport: "",
          departureDate: "",
          returnDate: "",
          tripType: "roundTrip",
          adults: 1,
          children: 0,
          infants: 0,
          cabinClass: "ECONOMY",
        },
  });

  const tripType = form.watch("tripType");
  const fromAirportRef = useRef<FromAirportRef | null>(null);
  const toAirportRef = useRef<ToAirportRef | null>(null);
  const savedReturnDateRef = useRef<string | undefined>(undefined);

  // Load saved search data from localStorage or defaultValues on mount (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      try {
        // Get stored search data for display values (fromAirportDisplay, toAirportDisplay)
        const storedSearch = getLastSearchFromStorage();
        const dataToLoad = defaultValues || lastSearch;

        // Use stored search for display values if available, otherwise use dataToLoad
        const displayData = storedSearch || dataToLoad;

        if (dataToLoad) {
          if (dataToLoad.fromAirport) {
            form.setValue("fromAirport", dataToLoad.fromAirport, {
              shouldValidate: false,
            });
          }
          if (dataToLoad.toAirport) {
            form.setValue("toAirport", dataToLoad.toAirport, {
              shouldValidate: false,
            });
          }

          setTimeout(() => {
            // Use displayData for display values (from localStorage if available)
            if (displayData?.fromAirportDisplay && fromAirportRef.current) {
              fromAirportRef.current.setDisplayValue(
                displayData.fromAirportDisplay
              );
            }
            if (dataToLoad.fromAirportCity && fromAirportRef.current) {
              fromAirportRef.current.setCity(dataToLoad.fromAirportCity);
            }
            if (displayData?.toAirportDisplay && toAirportRef.current) {
              toAirportRef.current.setDisplayValue(
                displayData.toAirportDisplay
              );
            }
            if (dataToLoad.toAirportCity && toAirportRef.current) {
              toAirportRef.current.setCity(dataToLoad.toAirportCity);
            }
          }, 50);

          if (dataToLoad.departureDate) {
            form.setValue("departureDate", dataToLoad.departureDate, {
              shouldValidate: false,
            });
          }
          if (dataToLoad.returnDate) {
            form.setValue("returnDate", dataToLoad.returnDate, {
              shouldValidate: false,
            });
            savedReturnDateRef.current = dataToLoad.returnDate;
          }
          if (dataToLoad.tripType) {
            form.setValue("tripType", dataToLoad.tripType, {
              shouldValidate: false,
            });
          }
          if (dataToLoad.adults !== undefined) {
            form.setValue("adults", dataToLoad.adults, {
              shouldValidate: false,
            });
          }
          if (dataToLoad.children !== undefined) {
            form.setValue("children", dataToLoad.children, {
              shouldValidate: false,
            });
          }
          if (dataToLoad.infants !== undefined) {
            form.setValue("infants", dataToLoad.infants, {
              shouldValidate: false,
            });
          }
          if (dataToLoad.cabinClass) {
            form.setValue("cabinClass", dataToLoad.cabinClass, {
              shouldValidate: false,
            });
          }
        }
      } catch (error) {
        console.error("Error loading saved search data:", error);
      }
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const onSubmit = async (data: FlightSearchParams) => {
    try {
      const formattedData: FlightSearchParams = {
        ...data,
        departureDate: formatDateToString(data.departureDate),
        returnDate: data.returnDate
          ? formatDateToString(data.returnDate)
          : undefined,
      };

      const searchParams = new URLSearchParams();

      if (formattedData.fromAirport)
        searchParams.append("fromAirport", formattedData.fromAirport);
      if (formattedData.toAirport)
        searchParams.append("toAirport", formattedData.toAirport);
      if (formattedData.departureDate)
        searchParams.append("departureDate", formattedData.departureDate);
      if (formattedData.tripType)
        searchParams.append("tripType", formattedData.tripType);
      if (formattedData.returnDate && formattedData.tripType === "roundTrip")
        searchParams.append("returnDate", formattedData.returnDate);
      if (formattedData.adults)
        searchParams.append("adults", formattedData.adults.toString());
      if (formattedData.children && formattedData.children > 0)
        searchParams.append("children", formattedData.children.toString());
      if (formattedData.infants && formattedData.infants > 0)
        searchParams.append("infants", formattedData.infants.toString());
      if (formattedData.cabinClass)
        searchParams.append("cabinClass", formattedData.cabinClass);

      const fromDisplayValue = fromAirportRef.current?.getDisplayValue() || "";
      const toDisplayValue = toAirportRef.current?.getDisplayValue() || "";
      const fromCity = fromAirportRef.current?.getCity() || "";
      const toCity = toAirportRef.current?.getCity() || "";

      if (fromCity) {
        searchParams.append("fromAirportCity", fromCity);
      }
      if (toCity) {
        searchParams.append("toAirportCity", toCity);
      }

      const dataToSave = {
        ...formattedData,
        fromAirportDisplay: fromDisplayValue,
        toAirportDisplay: toDisplayValue,
        fromAirportCity: fromCity,
        toAirportCity: toCity,
      };
      localStorage.setItem(localStorageFlightSearchKey, JSON.stringify(dataToSave));

      Router.push(`/flights?${searchParams.toString()}`);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="relative">
      <div
        className={` bg-primary-light p-2 py-5 sm:p-5 
          ${defaultValues
            ? "rounded-2xl "
            : "rounded-b-2xl ltr:rounded-tr-2xl rtl:rounded-tl-2xl "
          }
            `}
        style={{ width: "100%" }}
      >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-5 gap-x-4 gap-y-4 w-full h-full"
          style={{ width: "100%" }}
        >
          <FromAirport form={form} ref={fromAirportRef} />
          <ToAirport form={form} ref={toAirportRef} />
          <FlightDatePicker form={form} />
          <FlightPassenger form={form} />
          <div className="flex justify-end items-center col-span-1">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="px-4 sm:px-6 w-full max-w-[200px]  
              flex items-center justify-center gap-2 rounded-full font-bold 
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            // style={{ fontSize: "16px" }}
            >
              <FaSearch />
              {t("search")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightSearchBox;
