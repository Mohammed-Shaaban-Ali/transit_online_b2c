"use client";

import FilterSection from "@/components/pages/flights-test/showfarefirst/ShowFareResultsSection/ShowFareFilters/components/FilterSection";
import FilterCheckboxRow from "@/components/pages/flights-test/showfarefirst/ShowFareResultsSection/ShowFareFilters/FilterCheckboxRow";

type Props = {
  title: string;
  selected: number[];
  onToggle: (rating: number) => void;
};

export default function StarRatingFilter({ title, selected, onToggle }: Props) {
  const starRatings = [5, 4, 3, 2, 1];

  return (
    <FilterSection title={title} className="mb-4">
      <div className="space-y-1">
        {starRatings.map((rating) => (
          <FilterCheckboxRow
            key={rating}
            label={`${"★".repeat(rating)} `}
            checked={selected.includes(rating)}
            onCheckedChange={() => onToggle(rating)}
          />
        ))}
      </div>
    </FilterSection>
  );
}
