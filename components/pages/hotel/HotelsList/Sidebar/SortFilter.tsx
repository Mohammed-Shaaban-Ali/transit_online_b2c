"use client";

import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import Checkbox from "@/components/shared/form/Checkbox";
import { SortOption } from "@/redux/features/hotels/hotelFilterSlice";
import { useTranslations } from "next-intl";

const SortFilter = () => {
  const t = useTranslations("HotelsList.MobileSidebar");
  const { sortBy, setSortBy } = useHotelFilterRedux();

  // Sort options
  const sortOptions: { id: SortOption; label: string }[] = [
    { id: "price_low", label: t("sortPriceLow") },
    { id: "price_high", label: t("sortPriceHigh") },
    { id: "rating_low", label: t("sortRatingLow") },
    { id: "rating_high", label: t("sortRatingHigh") },
  ];

  // Handle sort selection (only one can be selected)
  const handleSortSelect = (option: SortOption) => {
    if (sortBy === option) {
      setSortBy(null); // Deselect if already selected
    } else {
      setSortBy(option);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {sortOptions.map((option) => (
        <Checkbox
          key={option.id}
          name={option.id || ""}
          checked={sortBy === option.id}
          onChange={() => handleSortSelect(option.id)}
          label={option.label}
          count=""
        />
      ))}
    </div>
  );
};

export default SortFilter;
