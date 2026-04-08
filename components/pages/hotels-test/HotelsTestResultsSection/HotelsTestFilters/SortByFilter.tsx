"use client";

import { SortOption } from "@/redux/features/hotels/hotelFilterSlice";
import FilterSection from "@/components/pages/flights-test/showfarefirst/ShowFareResultsSection/ShowFareFilters/components/FilterSection";

type Option = { id: SortOption; label: string };

type Props = {
  title: string;
  options: Option[];
  selected: SortOption | null;
  onChange: (next: SortOption | null) => void;
};

export default function SortByFilter({
  title,
  options,
  selected,
  onChange,
}: Props) {
  return (
    <FilterSection title={title} className="mb-4">
      <div className="space-y-1">
        {options.map((opt) => (
          <label
            key={opt.id}
            onClick={() => onChange(selected === opt.id ? null : opt.id)}
            className="flex cursor-pointer font-normal items-center gap-2 rounded-md px-2 py-1.5 text-[14px] hover:bg-white transition-colors"
          >
            <span
              className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selected === opt.id ? "border-gray-900" : "border-gray-400"
              }`}
            >
              {selected === opt.id && (
                <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
              )}
            </span>
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </FilterSection>
  );
}
