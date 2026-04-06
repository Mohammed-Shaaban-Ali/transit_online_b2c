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
  RiTimeLine,
} from "react-icons/ri";
import { useLocale, useTranslations } from "next-intl";
import {
  getHotelRecentSearches,
  type HotelRecentSearchItem,
} from "@/utils/hotelRecentSearches";
import { cn } from "@/lib/utils";
import type { HotelsTestFormValues } from "./HotelsTestHotelSearchForm";

function formatShortDate(dateStr: string, locale: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

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
          <div
            className={cn(
              "flex h-full  w-full min-w-0 flex-1 items-center gap-3 px-3.5 py-2 text-start  sm:px-2",
              "rounded-md border-0 bg-transparent transition-colors duration-150 cursor-pointer",
              open ? "bg-primary/10" : "hover:bg-primary/10",
            )}
            onClick={() => !open && setOpen(true)}
          >
            <RiMapPin2Line className="size-[18px] shrink-0  sm:size-5" />
            {open ? (
              <input
                ref={inputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t("whereTo")}
                autoComplete="off"
                onClick={(e) => e.stopPropagation()}
                className="min-w-0 flex-1 bg-transparent text-[15px] font-bold leading-snug outline-none placeholder:text-gray-500 text-slate-900"
              />
            ) : (
              <span
                title={displayValue || t("whereTo")}
                className={cn(
                  "min-w-0 flex-1 truncate text-[15px] font-bold leading-snug sm:text-[16px]",
                  displayValue ? "text-slate-900" : "text-gray-500",
                )}
              >
                {displayValue || t("whereTo")}
              </span>
            )}
            {hasDestination && !open && (
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
                aria-label={t("clearDestination")}
              >
                <RiCloseCircleFill className="text-gray-500" size={18} />
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={0}
          avoidCollisions={false}
          className="border-none bg-transparent p-0 shadow-none"
        >
          <div className="w-[min(100vw-32px,600px)] rounded-md border border-gray-200 bg-white shadow-xl">
            <div className="max-h-[360px] overflow-y-auto p-4 text-black">
              {recentItems.length > 0 && !isSearching && (
                <>
                  <h4 className="mb-2 p-1 text-[16px] font-semibold text-gray-700">
                    {t("recentSearches")}
                  </h4>
                  <div className="mb-4 space-y-0.5">
                    {recentItems.slice(0, 5).map((item, idx) => {
                      const totalAdults = (item.rooms || []).reduce(
                        (sum, r) => sum + (r.AdultsCount || 0),
                        0,
                      );
                      const totalKids = (item.rooms || []).reduce(
                        (sum, r) => sum + (r.KidsAges?.length || 0),
                        0,
                      );
                      const roomCount = item.rooms?.length || 1;
                      const occupancyParts = [
                        `${roomCount} ${roomCount === 1 ? t("room") : t("rooms")}`,
                        `${totalAdults} ${totalAdults === 1 ? t("adult") : t("adults")}`,
                        ...(totalKids > 0
                          ? [
                              `${totalKids} ${totalKids === 1 ? t("child") : t("children")}`,
                            ]
                          : []),
                      ];
                      return (
                        <button
                          key={`${item.searchValue}-${item.checkIn}-${idx}`}
                          type="button"
                          onClick={() => {
                            onApplyRecent?.(item);
                            setOpen(false);
                            setSearchText("");
                          }}
                          className="flex w-full items-center gap-3 rounded-sm px-2 py-2.5 text-start transition-colors hover:bg-blue-50"
                        >
                          <RiTimeLine
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                          <span className="min-w-[60px] shrink-0 truncate text-[15px] text-black/70">
                            {item.searchValue}
                          </span>
                          <span className="min-w-0 truncate text-[15px] text-black/70 ">
                            {formatShortDate(item.checkIn, locale)} -{" "}
                            {formatShortDate(item.checkOut, locale)}
                          </span>
                          <span className="text-gray-300">|</span>
                          <span className="shrink-0 text-[15px] text-black/70 ">
                            {occupancyParts.join(", ")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mb-3 border-t border-gray-200 pt-3"></div>
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
