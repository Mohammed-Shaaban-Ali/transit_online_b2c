"use client";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import { SortOption } from "@/redux/features/hotels/hotelFilterSlice";
import { HotelFilters } from "@/types/hotels";
import { convertPrice, CURRENCY_CONFIG } from "@/config/currency";
import mapImage from "@/public/images/map.jpg";
import StaticFiltersPanel from "@/components/pages/hotels-test/HotelsTestResultsSection/HotelsTestFilters/StaticFiltersPanel";
import HotelSearchFilter from "@/components/pages/hotels-test/HotelsTestResultsSection/HotelsTestFilters/HotelSearchFilter";
import StarRatingFilter from "@/components/pages/hotels-test/HotelsTestResultsSection/HotelsTestFilters/StarRatingFilter";
import ExpandableCheckboxFilter from "@/components/pages/hotels-test/HotelsTestResultsSection/HotelsTestFilters/ExpandableCheckboxFilter";
import SortByFilter from "@/components/pages/hotels-test/HotelsTestResultsSection/HotelsTestFilters/SortByFilter";
import BudgetFilterSection from "@/components/pages/hotels-test/HotelsTestResultsSection/HotelsTestFilters/BudgetFilterSection";

type Props = {
  filters?: HotelFilters;
};

export default function HotelsTestFilters({ filters }: Props) {
  const tSidebar = useTranslations("HotelsList.Sidebar");
  const tMobile = useTranslations("HotelsList.MobileSidebar");
  const tSearch = useTranslations("HotelsList.SearchBox");
  const tFilters = useTranslations("HotelsList.Filters");
  const locale = useLocale();
  const currencySymbol =
    locale === "ar"
      ? CURRENCY_CONFIG.currencySymbolAr
      : CURRENCY_CONFIG.currencySymbolEn;

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
  } = useHotelFilterRedux();

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

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: "price_low", label: tMobile("sortPriceLow") },
    { id: "price_high", label: tMobile("sortPriceHigh") },
    { id: "rating_high", label: tMobile("sortRatingHigh") },
    { id: "rating_low", label: tMobile("sortRatingLow") },
  ];

  const chains = filters?.chains ?? [];
  const propertyTypes = filters?.propertyTypes ?? [];
  const facilities = filters?.facilities ?? [];

  return (
    <aside className="p-1">
      <div className="relative  h-28 w-full rounded-md overflow-hidden mb-4 ">
        <Image
          src={mapImage}
          alt="map"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-white/10"></div>
      </div>
      <HotelSearchFilter
        title={tSidebar("searchHotel")}
        placeholder={tSearch("placeholder")}
        value={hotelName}
        onChange={setHotelName}
      />

      <StarRatingFilter
        title={tSidebar("starRating")}
        selected={selectedRating}
        onToggle={toggleRating}
      />

      <ExpandableCheckboxFilter
        title={tSidebar("hotelChain")}
        items={chains}
        selectedIds={selectedChains}
        onToggle={toggleChain}
        limit={10}
        showMoreLabel={tFilters("showMore")}
        showLessLabel={tFilters("showLess")}
        withChevron
        defaultOpen
      />

      <ExpandableCheckboxFilter
        title={tSidebar("propertyType")}
        items={propertyTypes}
        selectedIds={selectedPropertyTypes}
        onToggle={togglePropertyType}
        limit={10}
        showMoreLabel={tFilters("showMore")}
        showLessLabel={tFilters("showLess")}
        defaultOpen
        withChevron={false}
      />

      <SortByFilter
        title={tSidebar("sortBy")}
        options={sortOptions}
        selected={sortBy}
        onChange={setSortBy}
      />

      <BudgetFilterSection
        hotels={hotels}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        minPrice={minPrice}
        maxPrice={maxPrice}
        currencySymbol={currencySymbol}
      />

      <ExpandableCheckboxFilter
        title={tSidebar("facilities")}
        items={facilities}
        selectedIds={selectedFacilities}
        onToggle={toggleFacility}
        limit={15}
        showMoreLabel={tFilters("showMore")}
        showLessLabel={tFilters("showLess")}
        withChevron
        defaultOpen={false}
      />

      <StaticFiltersPanel />
    </aside>
  );
}
