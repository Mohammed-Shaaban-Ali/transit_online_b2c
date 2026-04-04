"use client";

import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import useDebounce from "@/hooks/useDebounce";
import { useGetAllCitiesQuery } from "@/redux/features/hotels/hotelsApi";
import type { cityTypes } from "@/components/shared/HotelSearchBox/LocationSearch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  RiCloseCircleFill,
  RiMapPin2Fill,
  RiMapPin2Line,
} from "react-icons/ri";
import { useLocale, useTranslations } from "next-intl";
import {
  getHotelRecentSearches,
  type HotelRecentSearchItem,
} from "@/utils/hotelRecentSearches";
import { cn } from "@/lib/utils";
import type { HotelsTestFormValues } from "./HotelsTestHotelSearchForm";

type Props = {
  form: UseFormReturn<HotelsTestFormValues>;
  error?: string;
  onApplyRecent?: (item: HotelRecentSearchItem) => void;
};

function WhereToPopover({ form, error, onApplyRecent }: Props) {
  const t = useTranslations("HotelsTestPage.HotelSearchForm");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { setValue, watch, clearErrors, trigger, formState } = form;
  const searchValue = watch("searchValue") || "";
  const displayValue = searchValue;

  const debouncedSearch = useDebounce(searchText, 400);
  const isSearching = debouncedSearch.trim().length > 0;

  const { data: searchData, isFetching: searchFetching } = useGetAllCitiesQuery(
    { code: "", name: debouncedSearch || "" },
    { skip: !isSearching },
  );

  const { data: defaultData, isFetching: defaultFetching } =
    useGetAllCitiesQuery(
      { code: "", name: "" },
      { skip: !open || isSearching },
    );

  const cities = isSearching ? searchData?.data || [] : defaultData?.data || [];
  const isFetching = isSearching ? searchFetching : defaultFetching;

  const [recentItems, setRecentItems] = useState<HotelRecentSearchItem[]>([]);

  useEffect(() => {
    if (open) {
      setSearchText("");
      setRecentItems(getHotelRecentSearches().slice(0, 6));
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const clearDestination = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setValue("searchValue", "", { shouldValidate: true });
    setValue("location", { latitude: 0, longitude: 0 });
    setValue("locationId", undefined);
    setValue("locationCode", undefined);
    setValue("storedLocale", undefined);
    clearErrors("location");
    void trigger("location");
  };

  const handleSelectCity = (city: cityTypes) => {
    setValue("searchValue", city.name, { shouldValidate: true });
    setValue("location", {
      latitude: city.latitude,
      longitude: city.longitude,
    });
    setValue("locationId", city.id);
    setValue("locationCode", city.code);
    setValue("storedLocale", locale);
    clearErrors("location");
    void trigger("location");
    setOpen(false);
    setSearchText("");
  };

  const locationError = formState.errors.location?.message as
    | string
    | undefined;
  const countryError = formState.errors.country?.message as string | undefined;

  const hasDestination = displayValue.trim().length > 0;

  return (
    <div className="relative flex  min-w-0 flex-1 flex-col self-stretch">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-full  w-full min-w-0 flex-1 items-center gap-3 px-3.5 py-2 text-start  sm:px-2",
              "rounded-md border-0 bg-transparent transition-colors duration-150",
              "hover:bg-primary/10 data-[state=open]:bg-primary/10",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/25",
            )}
          >
            <RiMapPin2Line className="size-[18px] shrink-0  sm:size-5" />
            <span
              title={displayValue || t("whereTo")}
              className={cn(
                "min-w-0 flex-1 truncate text-[15px] font-bold leading-snug sm:text-[16px]",
                displayValue ? "text-slate-900" : "text-gray-500",
              )}
            >
              {displayValue || t("whereTo")}
            </span>
            {hasDestination && (
              <span
                role="button"
                tabIndex={0}
                onClick={clearDestination}
                onMouseDown={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    clearDestination(e);
                  }
                }}
                className="flex size-6 shrink-0 items-center justify-center rounded-full 
                 text-[13px] font-light leading-none "
                aria-label="Clear"
              >
                <RiCloseCircleFill className="text-gray-500" size={18} />
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={-63}
          avoidCollisions={false}
          className="border-none bg-transparent p-0 shadow-none"
        >
          <div className="w-[min(100vw-32px,480px)] rounded-md border border-gray-200 bg-white shadow-xl">
            <div className="border-b border-gray-200 px-4 py-3">
              <input
                ref={inputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t("whereTo")}
                autoComplete="off"
                className="h-[58px] w-full rounded-sm border border-gray-300 px-3 text-[15px] font-medium outline-none placeholder:text-gray-500"
              />
            </div>

            <div className="max-h-[360px] overflow-y-auto p-4 text-black">
              {recentItems.length > 0 && !isSearching && (
                <>
                  <h4 className="mb-3 text-[14px] font-semibold">
                    {t("recentSearches")}
                  </h4>
                  <div className="mb-5 space-y-1">
                    {recentItems.map((item, idx) => (
                      <button
                        key={`${item.searchValue}-${item.checkIn}-${idx}`}
                        type="button"
                        onClick={() => {
                          onApplyRecent?.(item);
                          setOpen(false);
                          setSearchText("");
                        }}
                        className="flex w-full items-start gap-2 rounded-sm p-2 py-3 text-start transition-colors hover:bg-blue-50"
                      >
                        <RiMapPin2Fill
                          size={16}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />
                        <div className="flex min-w-0 flex-col">
                          <span className="text-[14px] font-medium text-gray-900">
                            {item.searchValue}
                          </span>
                          <span className="text-[12px] text-gray-500">
                            {item.checkIn} → {item.checkOut}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mb-3 border-t border-gray-200 pt-3">
                    <h4 className="text-[14px] text-gray-500">
                      {t("allCities")}
                    </h4>
                  </div>
                </>
              )}

              {isFetching ? (
                <div className="px-2 py-3 text-[14px] text-gray-500">
                  {t("searching")}
                </div>
              ) : cities.length === 0 ? (
                <div className="px-2 py-3 text-[14px] text-gray-500">
                  {isSearching ? t("noResults") : t("loadingCities")}
                </div>
              ) : (
                <div className="space-y-1">
                  {cities.map((city: cityTypes) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className="flex w-full items-center gap-2 rounded-sm p-2 py-3 text-start transition-colors hover:bg-blue-50"
                    >
                      <RiMapPin2Fill
                        size={16}
                        className="shrink-0 text-gray-400"
                      />
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-gray-900">
                          {city.name}
                        </span>
                        <span className="text-[12px] text-gray-500">
                          {city.code}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {(error || locationError || countryError) && (
        <div className="absolute -bottom-1 start-3 space-y-0.5 sm:start-4">
          {countryError ? (
            <p className="text-xs font-medium text-red-500">{countryError}</p>
          ) : null}
          {error || locationError ? (
            <p className="text-xs font-medium text-red-500">
              {error || locationError}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default WhereToPopover;
