import useDebounce from "@/hooks/useDebounce";
import { useState, useMemo, useRef, useEffect } from "react";
import { searchHotelsParams } from "..";
import { UseFormReturn } from "react-hook-form";
import { RiMapPin2Fill } from "react-icons/ri";
import { useGetAllCitiesQuery } from "@/redux/features/hotels/hotelsApi";
import { useTranslations, useLocale } from "next-intl";
import { localStorageHotelSearchKey } from "@/constants";
export interface cityTypes {
  id: number;
  code: string;
  latitude: number;
  longitude: number;
  name: string;
}
type Props = {
  form: UseFormReturn<searchHotelsParams & { searchValue?: string; locationId?: number; locationCode?: string; storedLocale?: string }>;
};

function LocationSearch({ form }: Props) {
  const t = useTranslations("Components.HotelSearchBox.LocationSearch");
  const locale = useLocale();
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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

  // Show dropdown when there are results and input is focused
  useEffect(() => {
    if (isFocused && filteredCities.length > 0) {
      setShowDropdown(true);
    } else if (!isFocused) {
      // Delay hiding to allow click events
      const timer = setTimeout(() => setShowDropdown(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isFocused, filteredCities.length]);

  const handleOptionClick = (item: cityTypes) => {
    setValue("searchValue", item.name);
    setValue("location", {
      latitude: item.latitude,
      longitude: item.longitude,
    });
    // Store the city id, code, and current locale for language change handling
    setValue("locationId", item.id);
    setValue("locationCode", item.code);
    setValue("storedLocale", locale);
    // Clear the location error immediately after selecting a valid location
    clearErrors("location");
    // Trigger validation to ensure the form state is updated
    trigger("location");
    setShowDropdown(false);
    setIsFocused(false);
    inputRef.current?.blur();
  };

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
  // Only use hasValue after mount to prevent hydration mismatch
  const isActive = isFocused || (isMounted && hasValue);
  return (
    <div className="col-span-1 relative">
      <div>
        {/* label */}
        <div
          className="relative flex items-center  px-4 h-16 bg-transparent
           transition-all duration-300"
        >
          <label
            htmlFor="searchValue"
            className={`absolute start-4 transition-all font-bold duration-200 pointer-events-none ${isActive
              ? "-top-0.5 text-gray-500"
              : "top-1/2 -translate-y-1/2 text-gray-500"
              }`}
          >
            {t("destination")}
          </label>
          <div className="flex items-center gap-1 relative w-full">
            <RiMapPin2Fill
              size={20}
              className={` 
                  absolute top-[19px]  start-0
                  ${isActive ? "text-gray-400" : "text-transparent"}`}
            />
            <input
              autoComplete="off"
              type="search"
              className={` w-full font-bold text-black bg-transparent border-none outline-none p-0 ${isActive ? "mt-4 ps-6" : ""
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

      {/* Dropdown with search results */}
      {showDropdown && (
        <SearchDropdown
          dropdownRef={dropdownRef}
          filteredCities={filteredCities}
          handleOptionClick={handleOptionClick}
          isFetching={isFetching}
        />
      )}

      {/* Error message */}
      {locationError && (
        <p title={locationError} className="absolute -bottom-1.5 start-4 text-xs text-red-500 font-medium line-clamp-1">
          {locationError}
        </p>
      )}
    </div>
  );
}

export default LocationSearch;

const SearchDropdown = ({
  dropdownRef,
  filteredCities,
  handleOptionClick,
  isFetching,
}: {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  filteredCities: cityTypes[];
  handleOptionClick: (city: cityTypes) => void;
  isFetching: boolean;
}) => {
  const t = useTranslations("Components.HotelSearchBox.LocationSearch");
  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
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
