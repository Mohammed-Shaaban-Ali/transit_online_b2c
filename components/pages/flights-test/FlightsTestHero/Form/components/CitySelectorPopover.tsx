"use client";

import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import useDebounce from "@/hooks/useDebounce";
import { useGetAllAirportsQuery } from "@/redux/features/airports/airportsApi";
import { airportTypes } from "@/types/airportTypes";
import { RiMapPin2Fill } from "react-icons/ri";
import { FlightSearchFormValues } from "../types";
import { MdFlightTakeoff } from "react-icons/md";
import { MdFlightLand } from "react-icons/md";

const RECENT_FROM_KEY = "flight-test-recent-from";
const RECENT_TO_KEY = "flight-test-recent-to";
const MAX_RECENT_CITIES = 6;

function getStorageKey(fieldName: "fromAirport" | "toAirport") {
  return fieldName === "fromAirport" ? RECENT_FROM_KEY : RECENT_TO_KEY;
}

function getRecentCities(
  fieldName: "fromAirport" | "toAirport",
): airportTypes[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(fieldName));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentCity(
  fieldName: "fromAirport" | "toAirport",
  airport: airportTypes,
) {
  try {
    const existing = getRecentCities(fieldName);
    const filtered = existing.filter((c) => c.id !== airport.id);
    const updated = [airport, ...filtered].slice(0, MAX_RECENT_CITIES);
    localStorage.setItem(getStorageKey(fieldName), JSON.stringify(updated));
  } catch {
    /* noop */
  }
}

type Props = {
  label: string;
  fieldName: "fromAirport" | "toAirport";
  form: UseFormReturn<FlightSearchFormValues>;
  displayValue: string;
  onDisplayValueChange: (value: string) => void;
  panelWidthClassName?: string;
  triggerClassName?: string;
  error?: string;
  mobileStyle?: boolean;
};

function CitySelectorPopover({
  label,
  fieldName,
  form,
  displayValue,
  onDisplayValueChange,
  panelWidthClassName = "w-[480px]",
  triggerClassName = "",
  error,
  mobileStyle = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [recentCities, setRecentCities] = useState<airportTypes[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const formValue = form.watch(fieldName);

  const debouncedSearch = useDebounce(searchText, 400);

  const isSearching = debouncedSearch.length > 0;
  const needsResolve = !!formValue && !displayValue;

  const { data: searchData, isFetching: isSearchFetching } =
    useGetAllAirportsQuery(
      { search: debouncedSearch, page: "1" },
      { skip: !isSearching },
    );

  const { data: resolveData } = useGetAllAirportsQuery(
    { search: formValue, page: "1" },
    { skip: !needsResolve },
  );

  useEffect(() => {
    if (!needsResolve || !resolveData?.items) return;
    const match = resolveData.items.find(
      (a: airportTypes) => a.id === formValue,
    );
    if (match) {
      onDisplayValueChange(`${match.name} (${match.id})`);
    }
  }, [needsResolve, resolveData, formValue, onDisplayValueChange]);

  const { data: defaultData, isFetching: isDefaultFetching } =
    useGetAllAirportsQuery(
      { search: "", page: "1" },
      { skip: !open || isSearching },
    );

  const airports = isSearching
    ? searchData?.items || []
    : defaultData?.items || [];
  const isFetching = isSearching ? isSearchFetching : isDefaultFetching;

  useEffect(() => {
    if (open) {
      setRecentCities(getRecentCities(fieldName));
      setSearchText("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, fieldName]);

  const handleSelect = (airport: airportTypes) => {
    form.setValue(fieldName, airport.id, { shouldValidate: true });
    onDisplayValueChange(`${airport.name} (${airport.id})`);
    saveRecentCity(fieldName, airport);
    setOpen(false);
    setSearchText("");
  };

  const iconSize = mobileStyle ? 18 : 20;
  const planeIcon =
    fieldName === "fromAirport" ? (
      <MdFlightTakeoff size={iconSize} className="" />
    ) : (
      <MdFlightLand size={iconSize} />
    );

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {mobileStyle ? (
            <button
              type="button"
              className={`flex h-[54px] w-full items-center gap-2 text-start ${triggerClassName}`}
            >
              {planeIcon}
              <span
                title={displayValue || label}
                className={
                  displayValue
                    ? "text-[15px] text-black font-medium line-clamp-1"
                    : "text-[15px] text-gray-500 line-clamp-1"
                }
              >
                {displayValue || label}
              </span>
            </button>
          ) : (
            <button
              type="button"
              className={`flex h-[58px] w-full items-center gap-2 rounded-sm border border-gray-300 px-3 text-start ${triggerClassName}`}
            >
              <span
                title={displayValue || label}
                className={
                  displayValue
                    ? "text-[16px] text-black font-medium line-clamp-1"
                    : "text-[16px] text-gray-500 line-clamp-1"
                }
              >
                {displayValue || label}
              </span>
            </button>
          )}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={mobileStyle ? -54 : -58}
          avoidCollisions={false}
          className="border-none bg-transparent p-0 shadow-none"
        >
          <div
            className={`${panelWidthClassName} rounded-md border border-gray-200 bg-white shadow-xl`}
          >
            <div className="border-b border-gray-200 px-4 py-3">
              <input
                ref={inputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={label}
                autoComplete="off"
                className="h-[58px] w-full rounded-sm border border-gray-300 px-3 text-[15px] font-medium outline-none placeholder:text-gray-500"
              />
            </div>

            <div className="max-h-[360px] overflow-y-auto p-4 text-black">
              {recentCities.length > 0 && !isSearching && (
                <>
                  <h4 className="mb-3 text-[14px] font-semibold">
                    Recent Searches
                  </h4>
                  <div className="mb-5 space-y-1">
                    {recentCities.map((airport) => (
                      <button
                        key={`recent-${airport.id}`}
                        type="button"
                        onClick={() => handleSelect(airport)}
                        className="flex w-full items-center gap-2 rounded-sm p-2 py-3 text-start hover:bg-blue-50 transition-colors"
                      >
                        <RiMapPin2Fill
                          size={16}
                          className="text-gray-400 shrink-0"
                        />
                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-gray-900">
                            {airport.name} ({airport.id})
                          </span>
                          {airport.city && (
                            <span className="text-[12px] text-gray-500">
                              {airport.city}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-3 mb-3">
                    <h4 className="text-[14px] text-gray-500">All Airports</h4>
                  </div>
                </>
              )}

              {isFetching ? (
                <div className="px-2 py-3 text-[14px] text-gray-500">
                  Searching...
                </div>
              ) : airports.length === 0 ? (
                <div className="px-2 py-3 text-[14px] text-gray-500">
                  {isSearching ? "No results found" : "Loading airports..."}
                </div>
              ) : (
                <div className="space-y-1">
                  {airports.map((airport: airportTypes) => (
                    <button
                      key={airport.id}
                      type="button"
                      onClick={() => handleSelect(airport)}
                      className="flex w-full items-center gap-2 rounded-sm p-2 py-3 text-start hover:bg-blue-50 transition-colors"
                    >
                      <RiMapPin2Fill
                        size={16}
                        className="text-gray-400 shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-gray-900">
                          {airport.name} ({airport.id})
                        </span>
                        {airport.city && (
                          <span className="text-[12px] text-gray-500">
                            {airport.city}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}

export default CitySelectorPopover;
