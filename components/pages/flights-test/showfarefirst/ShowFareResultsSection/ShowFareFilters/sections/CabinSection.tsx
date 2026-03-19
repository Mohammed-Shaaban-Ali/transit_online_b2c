"use client";

import { useState } from "react";
import FilterRadioRow from "../FilterRadioRow";
import FilterSection from "../components/FilterSection";

function CabinSection() {
  const [selectedCabin, setSelectedCabin] = useState("economy");

  return (
    <FilterSection title="Cabin" collapsible defaultOpen className="mb-4">
      <div className="space-y-1">
        {[
          { id: "economy", label: "Economy" },
          { id: "eco-premium", label: "Economy/premium economy" },
          { id: "premium", label: "Premium economy" },
          { id: "business-first", label: "Business/first" },
          { id: "business", label: "Business" },
          { id: "first", label: "First class" },
        ].map((item) => (
          <FilterRadioRow
            key={item.id}
            name="cabin"
            label={item.label}
            checked={selectedCabin === item.id}
            onCheckedChange={() => setSelectedCabin(item.id)}
          />
        ))}
      </div>
    </FilterSection>
  );
}

export default CabinSection;
