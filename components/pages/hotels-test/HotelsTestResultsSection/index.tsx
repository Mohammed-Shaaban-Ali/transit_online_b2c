"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, X } from "lucide-react";
import { hotelSeachTypes, HotelFilters } from "@/types/hotels";
import HotelsTestHotelCard from "./HotelsTestHotelCard";
import { HotelsTestHotelCardSkeletons } from "./HotelsTestSkeletons";
import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import { SlidersHorizontal } from "lucide-react";
import NoHotelsFound from "@/components/pages/hotel/HotelsList/NoHotelsFound";
import HotelsTestFilters from "./HotelsTestFilters";
import { SortOption } from "@/redux/features/hotels/hotelFilterSlice";

type Props = {
  uuid: string;
  isLoading: boolean;
  isError: boolean;
  filters?: HotelFilters;
  nights?: number;
  rooms?: number;
  adults?: number;
  children?: number;
  /** From API response; used so we do not hide filters before Redux syncs */
  apiHotelCount?: number;
};

const ITEMS_PER_PAGE = 10;

export default function HotelsTestResultsSection({
  uuid,
  isLoading,
  isError,
  filters,
  nights,
  rooms,
  adults,
  children,
  apiHotelCount = 0,
}: Props) {
  const locale = useLocale();
  const tForm = useTranslations("HotelsTestPage.HotelSearchForm");
  const tResults = useTranslations("HotelsTestPage.ResultsSection");
  const tMobile = useTranslations("HotelsList.MobileSidebar");
  const {
    filteredHotels,
    hotels: hotelsFromStore,
    sortBy,
    setSortBy,
  } = useHotelFilterRedux();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);

  const filteredList = filteredHotels ?? [];
  const showFilteredEmpty =
    filteredList.length === 0 && hotelsFromStore.length > 0;

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [filteredHotels?.length, sortBy]);

  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel || showFilteredEmpty) return;
    const total = filteredList.length;
    if (total === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < total) {
          setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, total));
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredList.length, showFilteredEmpty]);

  const sortSelectOptions = useMemo(
    () =>
      [
        { value: "default" as const, label: tMobile("sortRecommended") },
        { value: "price_low" as const, label: tMobile("sortPriceLow") },
        { value: "price_high" as const, label: tMobile("sortPriceHigh") },
        { value: "rating_high" as const, label: tMobile("sortRatingHigh") },
        { value: "rating_low" as const, label: tMobile("sortRatingLow") },
      ] as const,
    [tMobile],
  );

  const displayedHotels = filteredList.slice(0, visibleCount);

  if (isLoading) {
    return (
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block animate-pulse space-y-4 rounded-lg bg-white p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200" />
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-4 rounded bg-gray-100" />
              ))}
            </div>
          ))}
        </div>
        {/* Cards skeleton */}
        <HotelsTestHotelCardSkeletons count={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-4 rounded-lg bg-white p-8 text-center">
        <p className="text-[15px] text-red-500">{tForm("detailsError")}</p>
      </div>
    );
  }

  const hasRawHotels = hotelsFromStore.length > 0 || apiHotelCount > 0;

  if (!hasRawHotels) {
    return (
      <div className="mt-4 rounded-lg bg-white p-8 text-center">
        <p className="text-[15px] text-gray-500">
          {tResults("noHotelsFromApi")}
        </p>
      </div>
    );
  }

  const resultCount = showFilteredEmpty ? 0 : filteredList.length;
  const countLabel = tMobile("propertiesFound", {
    count: resultCount.toLocaleString(locale),
  });

  const sortSelectValue = sortBy ?? "default";

  return (
    <>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <HotelsTestFilters filters={filters} />
        </div>

        {/* Main content */}
        <div className="min-w-0">
          {/* Mobile filter bar */}
          <div className="mb-3 flex items-center justify-between rounded-lg bg-white px-3 py-2.5 lg:hidden">
            <p className="text-[13px] font-semibold text-gray-900">
              {countLabel}
            </p>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-gray-700"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {tResults("filters")}
            </button>
          </div>

          {/* Results count + sort (desktop) */}
          <div className="mb-3 hidden items-center justify-between gap-3  pb-3 lg:flex">
            <p className="text-[18px] font-semibold text-gray-900">
              {countLabel}
            </p>
            <Select
              value={sortSelectValue}
              onValueChange={(v) =>
                setSortBy(v === "default" ? null : (v as SortOption))
              }
            >
              <SelectTrigger
                size="sm"
                className="h-10!  shrink-0 rounded-md
                 border-gray-400 bg-white px-3 text-[15px] font-normal text-gray-900 shadow-none
                 gap-2!
                 "
              >
                <ArrowUpDown className="h-4 w-4 shrink-0 text-gray-600" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-lg border-gray-200">
                {sortSelectOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-[13px]"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hotel cards — same pattern as HotelsList: keep sidebar (PriceSlider) when filters exclude all */}
          {showFilteredEmpty ? (
            <NoHotelsFound />
          ) : (
            <div className="space-y-4">
              {displayedHotels.map((hotel: hotelSeachTypes) => (
                <HotelsTestHotelCard
                  key={hotel.id}
                  hotel={hotel}
                  uuid={uuid}
                  nights={nights}
                  rooms={rooms}
                  adults={adults}
                  children={children}
                />
              ))}
              {visibleCount < filteredList.length && (
                <div ref={loadMoreSentinelRef} className="h-10" aria-hidden />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent
          side="bottom"
          className="flex max-h-[min(92vh,calc(100%-1rem))] flex-col overflow-hidden rounded-t-2xl border-0 p-0 inset-x-3 bottom-3 w-auto sm:inset-x-4 sm:bottom-4 bg-[#f5f6f8] shadow-[0_-10px_40px_rgba(17,24,39,0.15)] [&>button.absolute]:hidden"
        >
          <SheetTitle className="sr-only">{tResults("filters")}</SheetTitle>
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
            <span className="text-[16px] font-semibold text-gray-900">
              {tResults("filters")}
            </span>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white px-3 py-2">
            <HotelsTestFilters filters={filters} />
          </div>
          <div className="shrink-0 border-t border-gray-100 bg-white px-4 pb-safe pt-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="h-11 w-full rounded-lg bg-primary text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
            >
              {tResults("showResults")}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
