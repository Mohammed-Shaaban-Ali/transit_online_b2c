"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import FilterSection from "@/components/pages/flights-test/showfarefirst/ShowFareResultsSection/ShowFareFilters/components/FilterSection";
import FilterCheckboxRow from "@/components/pages/flights-test/showfarefirst/ShowFareResultsSection/ShowFareFilters/FilterCheckboxRow";

type Item = { id: string; text: string; count: string };

type Props = {
  title: string;
  items: Item[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  limit: number;
  showMoreLabel: string;
  showLessLabel: string;
  defaultOpen?: boolean;
  withChevron?: boolean;
};

export default function ExpandableCheckboxFilter({
  title,
  items,
  selectedIds,
  onToggle,
  limit,
  showMoreLabel,
  showLessLabel,
  defaultOpen = true,
  withChevron = true,
}: Props) {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? items : items.slice(0, limit);

  if (!items.length) return null;

  return (
    <FilterSection
      title={title}
      collapsible
      defaultOpen={defaultOpen}
      className="mb-4"
    >
      <div className="space-y-1">
        {visibleItems.map((item) => (
          <FilterCheckboxRow
            key={item.id}
            label={`${item.text} (${item.count})`}
            checked={selectedIds.includes(item.id)}
            onCheckedChange={() => onToggle(item.id)}
          />
        ))}
      </div>
      {items.length > limit && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-2 flex w-full items-center justify-center gap-1 text-[13px] font-medium text-gray-900 hover:underline"
        >
          {showAll ? showLessLabel : showMoreLabel}
          {withChevron &&
            (showAll ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            ))}
        </button>
      )}
    </FilterSection>
  );
}
