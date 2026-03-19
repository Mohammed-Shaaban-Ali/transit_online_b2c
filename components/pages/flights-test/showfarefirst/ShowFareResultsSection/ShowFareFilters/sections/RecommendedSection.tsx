"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FilterCheckboxRow from "../FilterCheckboxRow";
import FilterSection from "../components/FilterSection";

function RecommendedSection() {
  const [recommended, setRecommended] = useState({
    nonstop: false,
    baggage: false,
    hideBudget: true,
  });

  return (
    <FilterSection title="Recommended" className="mb-4">
      <div className="space-y-1">
        {[
          { id: "nonstop", label: "Nonstop" },
          { id: "baggage", label: "Checked baggage included" },
          { id: "hideBudget", label: "Hide budget airlines" },
        ].map((item) => (
          <FilterCheckboxRow
            key={item.id}
            label={item.label}
            checked={recommended[item.id as keyof typeof recommended]}
            onCheckedChange={() =>
              setRecommended((prev) => ({
                ...prev,
                [item.id as keyof typeof recommended]:
                  !prev[item.id as keyof typeof recommended],
              }))
            }
          />
        ))}
      </div>

      <button
        type="button"
        className="mx-auto mt-2 flex items-center gap-1 text-[14px] text-primary transition-colors hover:text-primary/80"
      >
        Show More
        <ChevronDown size={14} />
      </button>
    </FilterSection>
  );
}

export default RecommendedSection;
