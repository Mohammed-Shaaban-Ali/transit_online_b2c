"use client";

import { useState } from "react";
import FilterCheckboxRow from "../FilterCheckboxRow";
import FilterSection from "../components/FilterSection";

function AirlinesSection() {
  const [airlines, setAirlines] = useState({
    american: false,
    delta: false,
    frontier: false,
    spirit: false,
  });

  return (
    <FilterSection title="Airlines" className="mb-4">
      <div className="space-y-1">
        {[
          { id: "american", label: "American Airlines (23)", price: "US$150" },
          { id: "delta", label: "Delta Air Lines (12)", price: "US$149" },
          { id: "frontier", label: "Frontier Airlines (10)", price: "US$93" },
          { id: "spirit", label: "Spirit Airlines (8)", price: "US$95" },
        ].map((item) => (
          <FilterCheckboxRow
            key={item.id}
            label={item.label}
            price={item.price}
            checked={airlines[item.id as keyof typeof airlines]}
            onCheckedChange={() =>
              setAirlines((prev) => ({
                ...prev,
                [item.id as keyof typeof airlines]:
                  !prev[item.id as keyof typeof airlines],
              }))
            }
          />
        ))}
      </div>
    </FilterSection>
  );
}

export default AirlinesSection;
