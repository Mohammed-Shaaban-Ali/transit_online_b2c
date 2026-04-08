"use client";

import FilterSection from "@/components/pages/flights-test/showfarefirst/ShowFareResultsSection/ShowFareFilters/components/FilterSection";

type Props = {
  title: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export default function HotelSearchFilter({
  title,
  placeholder,
  value,
  onChange,
}: Props) {
  return (
    <FilterSection title={title} className="mb-4">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[14px] text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
      />
    </FilterSection>
  );
}
