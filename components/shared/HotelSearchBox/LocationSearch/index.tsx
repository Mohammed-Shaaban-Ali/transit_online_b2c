import useDebounce from "@/hooks/useDebounce";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { searchHotelsParams } from "..";
import { UseFormReturn } from "react-hook-form";
import { RiHistoryLine, RiMapPin2Fill } from "react-icons/ri";
import { useGetAllCitiesQuery } from "@/redux/features/hotels/hotelsApi";
import { useTranslations, useLocale } from "next-intl";
import { localStorageHotelSearchKey } from "@/constants";
import { HotelHeroField } from "../hero/HotelHeroField";
import { POPULAR_HOTEL_DESTINATION_NAMES } from "../hero/popularDestinationNames";
import {
  getHotelRecentSearches,
  type HotelRecentSearchItem,
} from "@/utils/hotelRecentSearches";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
export interface cityTypes {
  id: number;
  code: string;
  latitude: number;
  longitude: number;
  name: string;
}
type Props = {
  form: UseFormReturn<searchHotelsParams & { searchValue?: string; locationId?: number; locationCode?: string; storedLocale?: string }>;
  variant?: "default" | "hero";
};

function LocationSearch({ form, variant = "default" }: Props) {
  const t = useTranslations("Components.HotelSearchBox.LocationSearch");
  const th = useTranslations("Components.HotelSearchBox.hero");
  const locale = useLocale();
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [popularLookupName, setPopularLookupName] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { register, setValue, watch, formState, clearErrors, trigger } = form;
  const selectedLocation = watch("location");
  const searchValue = watch("searchValue");
  const locationId = watch("locationId");
  const locationCode = watch("locationCode");
  const storedLocale = watch("storedLocale");
  const debouncedSearch = useDebounce(searchValue, 500);
  const locationError = formState.errors.location?.message as
    | string
    | undefined;

  // Determine if we need to fetch city name in current locale
  const needsLocaleUpdate = !!(
    locationCode &&
    locationId &&
    storedLocale &&
    storedLocale !== locale
  );

  const { ref: registerRef, ...registerProps } = register("searchValue");

  // Set mounted state after hydration to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isFetching } = useGetAllCitiesQuery(
    {
      code: "",
      name: debouncedSearch || "",
    },
    {
      skip: !debouncedSearch || debouncedSearch.trim().length === 0,
    }
  );
  const cities = data?.data || [];

  const { data: popularCityData } = useGetAllCitiesQuery(
    { code: "", name: popularLookupName || "" },
    { skip: !popularLookupName }
  );

  // Query to fetch city by code when locale changes
  const { data: cityByCodeData } = useGetAllCitiesQuery(
    {
      code: "",
      name: searchValue || "",
      id: locationId,
    },
    {
      skip: !needsLocaleUpdate,
    }
  );

  // Update the city name when we get the city data after locale change
  useEffect(() => {
    if (
      cityByCodeData?.data &&
      locationId &&
      needsLocaleUpdate
    ) {
      const city = cityByCodeData.data.find((c) => c.id === locationId);
      if (city) {
        setValue("searchValue", city.name, { shouldValidate: false });
        // Update the stored locale to prevent re-fetching
        setValue("storedLocale", locale, { shouldValidate: false });

        // Also update localStorage with the new name and locale
        try {
          const storedSearch = localStorage.getItem(localStorageHotelSearchKey);
          if (storedSearch) {
            const parsed = JSON.parse(storedSearch);
            parsed.searchValue = city.name;
            parsed.storedLocale = locale;
            localStorage.setItem(localStorageHotelSearchKey, JSON.stringify(parsed));
          }
        } catch (error) {
          console.error("Error updating localStorage:", error);
        }
      }
    }
  }, [cityByCodeData, locationId, needsLocaleUpdate, locale, setValue]);

  // Filter cities based on search value
  const filteredCities = useMemo(() => {
    if (!debouncedSearch || debouncedSearch.trim().length === 0) {
      return [];
    }
    return cities;
  }, [debouncedSearch, cities]);

  useEffect(() => {
    if (variant === "hero") {
      if (!isFocused) {
        const timer = setTimeout(() => setShowDropdown(false), 200);
        return () => clearTimeout(timer);
      }
      const hasTyped = !!(searchValue && searchValue.trim().length > 0);
      if (!hasTyped) {
        setShowDropdown(true);
        return;
      }
      setShowDropdown(true);
      return;
    }
    if (isFocused && filteredCities.length > 0) {
      setShowDropdown(true);
    } else if (!isFocused) {
      const timer = setTimeout(() => setShowDropdown(false), 200);
      return () => clearTimeout(timer);
    }
  }, [
    isFocused,
    filteredCities.length,
    variant,
    searchValue,
    debouncedSearch,
    isFetching,
  ]);

  const handleOptionClick = useCallback(
    (item: cityTypes) => {
      setValue("searchValue", item.name);
      setValue("location", {
        latitude: item.latitude,
        longitude: item.longitude,
      });
      setValue("locationId", item.id);
      setValue("locationCode", item.code);
      setValue("storedLocale", locale);
      clearErrors("location");
      trigger("location");
      setShowDropdown(false);
      setIsFocused(false);
      inputRef.current?.blur();
    },
    [clearErrors, locale, setValue, trigger]
  );

  useEffect(() => {
    if (!popularLookupName || !popularCityData?.data?.length) return;
    const list = popularCityData.data;
    const match =
      list.find(
        (c) => c.name.toLowerCase() === popularLookupName!.toLowerCase()
      ) || list[0];
    handleOptionClick(match);
    setPopularLookupName(null);
  }, [popularLookupName, popularCityData, handleOptionClick]);

  const applyRecentSearch = useCallback(
    (item: HotelRecentSearchItem) => {
      if (item.searchValue) setValue("searchValue", item.searchValue);
      setValue("location", item.location);
      setValue("checkIn", item.checkIn);
      setValue("checkOut", item.checkOut);
      setValue("rooms", item.rooms);
      setValue("country", item.country);
      setValue("radiusInMeters", item.radiusInMeters ?? 10000);
      if (item.locationId) setValue("locationId", item.locationId);
      if (item.locationCode) setValue("locationCode", item.locationCode);
      setValue("storedLocale", item.storedLocale || locale);
      clearErrors(["location", "checkIn", "checkOut"]);
      void trigger(["location", "checkIn", "checkOut"]);
      setShowDropdown(false);
      setIsFocused(false);
      inputRef.current?.blur();
    },
    [clearErrors, locale, setValue, trigger]
  );

  const recentItems = useMemo(() => {
    if (variant !== "hero" || typeof window === "undefined") return [];
    const list = getHotelRecentSearches();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return list.filter((item) => {
      if (!item.checkIn) return false;
      const d = new Date(item.checkIn);
      d.setHours(0, 0, 0, 0);
      return d >= today;
    });
  }, [variant, showDropdown]);

  // Set searchValue and location info from localStorage when location is provided but searchValue is not
  useEffect(() => {
    if (
      selectedLocation &&
      selectedLocation.latitude !== 0 &&
      selectedLocation.longitude !== 0
    ) {
      if (!searchValue || searchValue.trim().length === 0) {
        // Try to get searchValue from localStorage
        try {
          const storedSearch = localStorage.getItem(localStorageHotelSearchKey);
          if (storedSearch) {
            const parsed = JSON.parse(storedSearch);
            if (parsed.searchValue && parsed.location) {
              // Check if the location matches
              const storedLat = parsed.location.latitude;
              const storedLng = parsed.location.longitude;
              const currentLat = selectedLocation.latitude;
              const currentLng = selectedLocation.longitude;

              // If locations match (within small tolerance), use the stored searchValue
              if (
                Math.abs(storedLat - currentLat) < 0.001 &&
                Math.abs(storedLng - currentLng) < 0.001
              ) {
                setValue("searchValue", parsed.searchValue, {
                  shouldValidate: false,
                });
                // Also restore locationId, locationCode, and storedLocale if available
                if (parsed.locationId) {
                  setValue("locationId", parsed.locationId, {
                    shouldValidate: false,
                  });
                }
                if (parsed.locationCode) {
                  setValue("locationCode", parsed.locationCode, {
                    shouldValidate: false,
                  });
                }
                if (parsed.storedLocale) {
                  setValue("storedLocale", parsed.storedLocale, {
                    shouldValidate: false,
                  });
                }
              }
            }
          }
        } catch (error) {
          console.error("Error reading searchValue from localStorage:", error);
        }
      }
    }
  }, [selectedLocation, searchValue, setValue]);

  // Reset location when searchValue is cleared
  useEffect(() => {
    if (!searchValue || searchValue.trim().length === 0) {
      setValue(
        "location",
        {
          latitude: 0,
          longitude: 0,
        },
        { shouldValidate: false }
      );
    }
  }, [searchValue, setValue]);

  const hasValue = searchValue && searchValue.length > 0;
  const isActive = isFocused || (isMounted && hasValue);

  const typing = !!(searchValue && searchValue.trim().length > 0);
  const showHeroExplore = variant === "hero" && isFocused && !typing;

  const clearInput = () => {
    setValue("searchValue", "", { shouldValidate: true });
    setValue("location", { latitude: 0, longitude: 0 });
    trigger("location");
  };

  if (variant === "hero") {
    return (
      <div className="relative col-span-1 min-w-0 flex-[1.15]">
        <HotelHeroField active={isFocused}>
          <RiMapPin2Fill className="shrink-0 text-gray-500" size={18} aria-hidden />
          <div className="relative min-w-0 flex-1">
            <input
              id="searchValue-hero"
              autoComplete="off"
              type="search"
              placeholder={th("whereTo")}
              className="w-full min-w-0 border-none bg-transparent text-[15px] font-semibold text-gray-900 outline-none placeholder:text-gray-400"
              {...registerProps}
              ref={(e) => {
                inputRef.current = e;
                if (typeof registerRef === "function") {
                  registerRef(e);
                } else if (registerRef && "current" in registerRef) {
                  (
                    registerRef as React.MutableRefObject<HTMLInputElement | null>
                  ).current = e;
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          {isMounted && hasValue && (
            <button
              type="button"
              aria-label="Clear"
              className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              onMouseDown={(e) => e.preventDefault()}
              onClick={clearInput}
            >
              ×
            </button>
          )}
        </HotelHeroField>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute start-0 top-[calc(100%+6px)] z-50 max-h-[min(70vh,420px)] w-[min(100vw-32px,520px)] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl"
          >
            {showHeroExplore ? (
              <HeroExploreContent
                recentItems={recentItems}
                onRecentPick={applyRecentSearch}
                onPopularPick={(name) => setPopularLookupName(name)}
              />
            ) : (
              <SearchDropdown
                dropdownRef={dropdownRef}
                filteredCities={filteredCities}
                handleOptionClick={handleOptionClick}
                isFetching={
                  isFetching ||
                  (!!searchValue?.trim() &&
                    (debouncedSearch ?? "").trim() !== searchValue.trim())
                }
                flat
              />
            )}
          </div>
        )}

        {locationError && (
          <p
            title={locationError}
            className="absolute -bottom-1 start-3 text-xs font-medium text-red-500 line-clamp-1 sm:start-4"
          >
            {locationError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="col-span-1 relative">
      <div>
        <div
          className="relative flex h-16 items-center bg-transparent px-4 transition-all duration-300"
        >
          <label
            htmlFor="searchValue"
            className={`pointer-events-none absolute start-4 font-bold transition-all duration-200 ${
              isActive
                ? "-top-0.5 text-gray-500"
                : "top-1/2 -translate-y-1/2 text-gray-500"
            }`}
          >
            {t("destination")}
          </label>
          <div className="relative flex w-full items-center gap-0">
            <RiMapPin2Fill
              size={16}
              className={`absolute top-[15px] start-0 ${
                isActive ? "text-gray-400" : "text-transparent"
              }`}
            />
            <input
              autoComplete="off"
              type="search"
              className={`w-full border-none bg-transparent p-0 font-bold text-black outline-none ${
                isActive ? "mt-4 ps-5" : ""
              }`}
              {...registerProps}
              ref={(e) => {
                inputRef.current = e;
                if (typeof registerRef === "function") {
                  registerRef(e);
                } else if (registerRef && "current" in registerRef) {
                  (
                    registerRef as React.MutableRefObject<HTMLInputElement | null>
                  ).current = e;
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
        </div>
      </div>

      {showDropdown && (
        <SearchDropdown
          dropdownRef={dropdownRef}
          filteredCities={filteredCities}
          handleOptionClick={handleOptionClick}
          isFetching={isFetching}
        />
      )}

      {locationError && (
        <p
          title={locationError}
          className="absolute -bottom-1.5 start-4 line-clamp-1 text-xs font-medium text-red-500"
        >
          {locationError}
        </p>
      )}
    </div>
  );
}

function HeroExploreContent({
  recentItems,
  onRecentPick,
  onPopularPick,
}: {
  recentItems: HotelRecentSearchItem[];
  onRecentPick: (item: HotelRecentSearchItem) => void;
  onPopularPick: (name: string) => void;
}) {
  const th = useTranslations("Components.HotelSearchBox.hero");
  const tg = useTranslations("Components.HotelSearchBox.GuestSearch");

  const formatStay = (checkIn: string, checkOut: string) => {
    try {
      const a = format(new Date(checkIn), "MMM d");
      const b = format(new Date(checkOut), "MMM d");
      return `${a} - ${b}`;
    } catch {
      return "";
    }
  };

  const roomsSummary = (item: HotelRecentSearchItem) => {
    const n = item.rooms?.length ?? 1;
    const adults =
      item.rooms?.reduce((s, r) => s + r.AdultsCount, 0) ?? 0;
    return `${n} ${n === 1 ? tg("room") : tg("rooms")}, ${adults} ${tg("adultsLabel")}`;
  };

  return (
    <div className="p-3 sm:p-4">
      {recentItems.length > 0 && (
        <>
          <p className="mb-2 text-sm font-bold text-gray-900">
            {th("recentSearches")}
          </p>
          <div className="space-y-1">
            {recentItems.map((item, idx) => (
              <button
                key={`${item.searchValue}-${item.checkIn}-${idx}`}
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-start hover:bg-gray-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onRecentPick(item)}
              >
                <RiHistoryLine className="shrink-0 text-gray-400" size={18} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-gray-900">
                    {item.searchValue}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatStay(item.checkIn, item.checkOut)} · {roomsSummary(item)}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="my-3 border-t border-gray-100" />
        </>
      )}
      <p className="mb-2 text-sm font-bold text-gray-900">
        {th("popularDestinations")}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
        {POPULAR_HOTEL_DESTINATION_NAMES.map((name) => (
          <button
            key={name}
            type="button"
            className="rounded-lg px-2 py-2 text-center text-sm font-medium text-gray-800 hover:bg-sky-50 hover:text-primary"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onPopularPick(name)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

const SearchDropdown = ({
  dropdownRef,
  filteredCities,
  handleOptionClick,
  isFetching,
  flat,
}: {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  filteredCities: cityTypes[];
  handleOptionClick: (city: cityTypes) => void;
  isFetching: boolean;
  flat?: boolean;
}) => {
  const t = useTranslations("Components.HotelSearchBox.LocationSearch");
  return (
    <div
      ref={flat ? undefined : dropdownRef}
      className={cn(
        flat
          ? "max-h-[min(50vh,320px)] overflow-y-auto"
          : "absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
      )}
    >
      {isFetching ? (
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="font-semibold text-gray-500">{t("loading")}</span>
        </div>
      ) : filteredCities?.length == 0 ? (
        <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center gap-2">
          <span className="font-semibold text-gray-900">{t("noResults")}</span>
        </div>
      ) : (
        filteredCities?.map((city) => (
          <div
            key={city.id}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleOptionClick(city)}
            className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center gap-2"
          >
            <RiMapPin2Fill size={18} className="text-gray-500 shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">{city.name}</span>
              <span className="text-sm text-gray-500">{city.code}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LocationSearch;
