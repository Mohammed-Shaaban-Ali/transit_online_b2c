"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useTranslations } from "next-intl";
import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import { SortOption } from "@/redux/features/hotels/hotelFilterSlice";
import { HotelFilters } from "@/types/hotels";
import { convertPrice } from "@/config/currency";
import { formatePriceRaw } from "@/utils/formatePrice";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import FilterSection from "@/components/pages/flights-test/showfarefirst/ShowFareResultsSection/ShowFareFilters/components/FilterSection";
import FilterCheckboxRow from "@/components/pages/flights-test/showfarefirst/ShowFareResultsSection/ShowFareFilters/FilterCheckboxRow";

type Props = {
  filters?: HotelFilters;
};

export default function HotelsTestFilters({ filters }: Props) {
  const tSidebar = useTranslations("HotelsList.Sidebar");
  const tMobile = useTranslations("HotelsList.MobileSidebar");
  const tSearch = useTranslations("HotelsList.SearchBox");
  const tFilters = useTranslations("HotelsList.Filters");
  const tNoHotels = useTranslations("HotelsList.NoHotelsFound");

  const {
    hotels,
    selectedRating,
    selectedChains,
    selectedPropertyTypes,
    selectedFacilities,
    hotelName,
    priceRange,
    sortBy,
    toggleRating,
    toggleChain,
    togglePropertyType,
    toggleFacility,
    setPriceRange,
    setSortBy,
    setHotelName,
    resetFilters,
  } = useHotelFilterRedux();

  const [showAllChains, setShowAllChains] = useState(false);
  const [showAllPropertyTypes, setShowAllPropertyTypes] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);

  const { minPrice, maxPrice } = useMemo(() => {
    if (!hotels?.length) {
      return { minPrice: 0, maxPrice: 15000 };
    }
    const prices = hotels
      .map((h) =>
        convertPrice(
          parseFloat(h.price?.toString().replace(/[^\d.]/g, "") || "0"),
        ),
      )
      .filter((p) => !isNaN(p) && p > 0);
    if (prices.length === 0) {
      return { minPrice: 0, maxPrice: 15000 };
    }
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [hotels]);

  useEffect(() => {
    if (minPrice > 0 && maxPrice > minPrice) {
      if (priceRange.min === 0 && priceRange.max === 500) {
        setPriceRange({ min: minPrice, max: maxPrice });
      } else if (priceRange.min < minPrice || priceRange.max > maxPrice) {
        setPriceRange({
          min: Math.max(minPrice, priceRange.min),
          max: Math.min(maxPrice, priceRange.max),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice]);

  const handlePriceInput = useCallback(
    (val: number[]) => {
      setPriceRange({ min: val[0], max: val[1] });
    },
    [setPriceRange],
  );

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: "price_low", label: tMobile("sortPriceLow") },
    { id: "price_high", label: tMobile("sortPriceHigh") },
    { id: "rating_high", label: tMobile("sortRatingHigh") },
    { id: "rating_low", label: tMobile("sortRatingLow") },
  ];

  const starRatings = [5, 4, 3, 2, 1];

  const hasActiveFilters =
    selectedRating.length > 0 ||
    selectedChains.length > 0 ||
    selectedPropertyTypes.length > 0 ||
    selectedFacilities.length > 0 ||
    sortBy !== null ||
    hotelName.trim() !== "";

  const chains = filters?.chains ?? [];
  const propertyTypes = filters?.propertyTypes ?? [];
  const facilities = filters?.facilities ?? [];

  const chainLimit = 10;
  const propertyLimit = 10;
  const facilityLimit = 15;

  const visibleChains = showAllChains ? chains : chains.slice(0, chainLimit);
  const visiblePropertyTypes = showAllPropertyTypes
    ? propertyTypes
    : propertyTypes.slice(0, propertyLimit);
  const visibleFacilities = showAllFacilities
    ? facilities
    : facilities.slice(0, facilityLimit);

  return (
    <aside className="p-1">
      <FilterSection title={tSidebar("searchHotel")} className="mb-4">
        <input
          type="text"
          placeholder={tSearch("placeholder")}
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[14px] text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </FilterSection>

      <FilterSection title={tSidebar("starRating")} className="mb-4">
        <div className="space-y-1">
          {starRatings.map((r) => (
            <FilterCheckboxRow
              key={r}
              label={`${"★".repeat(r)} `}
              checked={selectedRating.includes(r)}
              onCheckedChange={() => toggleRating(r)}
            />
          ))}
        </div>
      </FilterSection>

      {chains.length > 0 && (
        <FilterSection
          title={tSidebar("hotelChain")}
          collapsible
          defaultOpen
          className="mb-4"
        >
          <div className="space-y-1">
            {visibleChains.map((c) => (
              <FilterCheckboxRow
                key={c.id}
                label={`${c.text} (${c.count})`}
                checked={selectedChains.includes(c.id)}
                onCheckedChange={() => toggleChain(c.id)}
              />
            ))}
          </div>
          {chains.length > chainLimit && (
            <button
              type="button"
              onClick={() => setShowAllChains((v) => !v)}
              className="mt-2 flex w-full items-center justify-center gap-1 text-[13px] font-medium text-gray-900 hover:underline"
            >
              {showAllChains ? tFilters("showLess") : tFilters("showMore")}
              {showAllChains ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </FilterSection>
      )}

      {propertyTypes.length > 0 && (
        <FilterSection
          title={tSidebar("propertyType")}
          collapsible
          defaultOpen
          className="mb-4"
        >
          <div className="space-y-1">
            {visiblePropertyTypes.map((pt) => (
              <FilterCheckboxRow
                key={pt.id}
                label={`${pt.text} (${pt.count})`}
                checked={selectedPropertyTypes.includes(pt.id)}
                onCheckedChange={() => togglePropertyType(pt.id)}
              />
            ))}
          </div>
          {propertyTypes.length > propertyLimit && (
            <button
              type="button"
              onClick={() => setShowAllPropertyTypes((v) => !v)}
              className="mt-2 flex w-full items-center justify-center gap-1 text-[13px] font-medium text-gray-900 hover:underline"
            >
              {showAllPropertyTypes
                ? tFilters("showLess")
                : tFilters("showMore")}
            </button>
          )}
        </FilterSection>
      )}

      <FilterSection title={tSidebar("sortBy")} className="mb-4">
        <div className="space-y-1">
          {sortOptions.map((opt) => (
            <FilterCheckboxRow
              key={opt.id || "none"}
              label={opt.label}
              checked={sortBy === opt.id}
              onCheckedChange={() =>
                setSortBy(sortBy === opt.id ? null : opt.id)
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title={tSidebar("budgetPerNight")} className="mb-4">
        <div className="mb-3">
          <p className="flex flex-wrap items-center gap-1 text-[14px] tabular-nums text-gray-600">
            <CurrencySymbol size="sm" />
            <span>
              {formatePriceRaw(priceRange.min).toLocaleString()} –{" "}
              {formatePriceRaw(priceRange.max).toLocaleString()}
            </span>
          </p>
        </div>
        <div dir="ltr">
          <RangeSlider
            className="hotels-test-fare-price-slider"
            min={minPrice}
            max={maxPrice}
            step={10}
            value={[priceRange.min, priceRange.max]}
            onInput={(val) => handlePriceInput(val as number[])}
          />
          <div className="mt-1 flex items-center justify-between gap-2 text-[13px] tabular-nums text-gray-600">
            <span className="inline-flex items-center gap-0.5">
              <CurrencySymbol size="sm" />
              {formatePriceRaw(minPrice).toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-0.5">
              <CurrencySymbol size="sm" />
              {formatePriceRaw(maxPrice).toLocaleString()}
            </span>
          </div>
        </div>
        <style jsx global>{`
          .hotels-test-fare-price-slider {
            width: 100%;
            height: 4px !important;
            background: #d1d5db !important;
            border-radius: 9999px;
          }
          .hotels-test-fare-price-slider .range-slider__range {
            height: 4px !important;
            background: #111827 !important;
            border-radius: 9999px;
          }
          .hotels-test-fare-price-slider .range-slider__thumb {
            width: 18px !important;
            height: 18px !important;
            border-radius: 50%;
            border: 2px solid #111827 !important;
            background: #fff !important;
            box-shadow: none !important;
            cursor: pointer;
          }
        `}</style>
      </FilterSection>

      {facilities.length > 0 && (
        <FilterSection
          title={tSidebar("facilities")}
          collapsible
          defaultOpen={false}
          className="mb-4"
        >
          <div className="space-y-1">
            {visibleFacilities.map((f) => (
              <FilterCheckboxRow
                key={f.id}
                label={`${f.text} (${f.count})`}
                checked={selectedFacilities.includes(f.id)}
                onCheckedChange={() => toggleFacility(f.id)}
              />
            ))}
          </div>
          {facilities.length > facilityLimit && (
            <button
              type="button"
              onClick={() => setShowAllFacilities((v) => !v)}
              className="mt-2 flex w-full items-center justify-center gap-1 text-[13px] font-medium text-gray-900 hover:underline"
            >
              {showAllFacilities ? tFilters("showLess") : tFilters("showMore")}
              {showAllFacilities ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </FilterSection>
      )}
    </aside>
  );
}
