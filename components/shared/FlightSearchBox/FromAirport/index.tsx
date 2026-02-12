"use client";

import { useLocale, useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import useDebounce from "@/hooks/useDebounce";
import { useGetAllAirportsQuery } from "@/redux/features/airports/airportsApi";
import { airportTypes } from "@/types/airportTypes";
import { RiFlightTakeoffFill, RiMapPin2Fill } from "react-icons/ri";

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

interface SearchBarProps {
  form: UseFormReturn<FlightSearchParams>;
}

export interface FromAirportRef {
  setDisplayValue: (value: string) => void;
  getDisplayValue: () => string;
  getCity: () => string;
  setCity: (value: string) => void;
}

const FromAirport = forwardRef<FromAirportRef, SearchBarProps>(
  ({ form }, ref) => {
    const locale = useLocale();
    const isRTL = locale === "ar";
    const t = useTranslations("Components.FlightSearchBox.FromAirport");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { setValue, watch, formState, clearErrors, trigger } = form;
    const [displayValue, setDisplayValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [city, setCity] = useState<string>("");
    const isInternalUpdateRef = useRef(false);
    const isUserTypingRef = useRef(false);
    const lastFormValueRef = useRef<string>("");
    const [searchById, setSearchById] = useState("");
    const debouncedSearch = useDebounce(displayValue, 500);
    const debouncedSearchById = useDebounce(searchById, 100);
    const formFromAirport = watch("fromAirport");
    const fromAirportError = formState.errors.fromAirport?.message as
      | string
      | undefined;

    // Search for airport by ID when form value exists but display value is empty (from localStorage)
    useEffect(() => {
      if (
        formFromAirport &&
        !displayValue &&
        !isUserTypingRef.current &&
        !isInternalUpdateRef.current
      ) {
        setSearchById(formFromAirport);
      } else if (!formFromAirport || displayValue) {
        setSearchById("");
      }
    }, [formFromAirport, displayValue]);

    const { data, isFetching } = useGetAllAirportsQuery(
      {
        search: debouncedSearch || debouncedSearchById,
        page: "1",
      },
      {
        skip: !debouncedSearch && !debouncedSearchById,
      }
    );
    const airports = data?.items || [];

    // Show dropdown when there are results and input is focused
    useEffect(() => {
      if (isFocused && airports.length > 0) {
        setShowDropdown(true);
      } else if (!isFocused) {
        const timer = setTimeout(() => setShowDropdown(false), 200);
        return () => clearTimeout(timer);
      }
    }, [isFocused, airports]);

    // Expose setDisplayValue, getDisplayValue, getCity, and setCity via ref
    useImperativeHandle(ref, () => ({
      setDisplayValue: (value: string) => {
        isInternalUpdateRef.current = true;
        setDisplayValue(value);
        setTimeout(() => {
          isInternalUpdateRef.current = false;
        }, 0);
      },
      getDisplayValue: () => displayValue,
      getCity: () => city,
      setCity: (value: string) => {
        setCity(value);
      },
    }));

    // Sync displayValue with form value when changed externally
    useEffect(() => {
      if (formFromAirport === lastFormValueRef.current) {
        return;
      }

      if (isInternalUpdateRef.current || isUserTypingRef.current) {
        lastFormValueRef.current = formFromAirport;
        return;
      }

      lastFormValueRef.current = formFromAirport;

      if (formFromAirport) {
        const airport = airports.find(
          (a: airportTypes) => a.id === formFromAirport
        );
        if (airport) {
          const newDisplayValue = `${airport.name} (${airport.id})`;
          setDisplayValue((prev) =>
            prev !== newDisplayValue ? newDisplayValue : prev
          );
          if (airport.city) {
            setCity(airport.city);
          }
        }
      } else {
        setDisplayValue((prev) => (prev && !formFromAirport ? "" : prev));
      }
    }, [formFromAirport, airports]);

    const handleOptionClick = (item: airportTypes) => {
      isInternalUpdateRef.current = true;
      isUserTypingRef.current = false;
      lastFormValueRef.current = item.id;
      setValue("fromAirport", item.id);
      setDisplayValue(`${item.name} (${item.id})`);
      if (item.city) {
        setCity(item.city);
      }
      // Clear the error immediately after selecting a valid airport
      clearErrors("fromAirport");
      trigger("fromAirport");
      setShowDropdown(false);
      setIsFocused(false);
      setTimeout(() => {
        isInternalUpdateRef.current = false;
      }, 0);
    };

    const hasValue = displayValue && displayValue.length > 0;
    const isActive = isFocused || hasValue;

    return (
      <div className="col-span-1 relative">
        <div>
          <div className="relative flex items-center px-4 h-16 bg-transparent transition-all duration-300">
            <label
              htmlFor="fromAirport"
              className={`absolute transition-all font-bold duration-200 pointer-events-none ${isActive
                ? "-top-0.5 text-gray-500"
                : "top-1/2 -translate-y-1/2 text-gray-500"
                }`}
            >
              {t("label")}
            </label>
            <div className="flex items-center gap-1 relative w-full">
              <RiFlightTakeoffFill
                size={20}
                className={`absolute top-[19px] start-0 ${isActive ? "text-gray-400" : "text-transparent"
                  }`}
              />
              <input
                id="fromAirport"
                autoComplete="off"
                type="search"
                className={`w-full font-bold text-black bg-transparent border-none outline-none p-0 ${isActive ? "mt-4 ps-6" : ""
                  }`}
                value={displayValue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => {
                  isUserTypingRef.current = true;
                  setDisplayValue(e.target.value);
                  if (!e.target.value) {
                    setValue("fromAirport", "");
                  }
                  setTimeout(() => {
                    isUserTypingRef.current = false;
                  }, 600);
                }}
              />
            </div>
          </div>
        </div>

        {/* Dropdown with search results */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {isFetching ? (
              <div className="px-4 py-3 flex items-center gap-2">
                <span className="font-semibold text-gray-500">
                  {t("loading")}
                </span>
              </div>
            ) : airports?.length === 0 ? (
              <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {t("noResults")}
                </span>
              </div>
            ) : (
              airports.map((item: airportTypes) => (
                <div
                  key={item.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleOptionClick(item)}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center gap-2"
                >
                  <RiMapPin2Fill size={18} className="text-gray-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {item.name} ({item.id})
                    </span>
                    <span className="text-sm text-gray-500">{item.city}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Error message */}
        {fromAirportError && (
          <p title={fromAirportError} className="absolute -bottom-1.5 start-4 text-xs text-red-500 font-medium line-clamp-1">
            {fromAirportError}
          </p>
        )}
      </div>
    );
  }
);

FromAirport.displayName = "FromAirport";

export default FromAirport;
