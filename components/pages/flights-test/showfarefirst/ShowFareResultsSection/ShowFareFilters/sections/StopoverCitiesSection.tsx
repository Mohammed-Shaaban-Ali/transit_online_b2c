"use client";

import { useState } from "react";
import FilterCheckboxRow from "../FilterCheckboxRow";
import FilterSection from "../components/FilterSection";

function StopoverCitiesSection() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const cities = [
    { id: "charlotte", label: "Charlotte", price: "US$299" },
    { id: "dc", label: "Washington D.C.", price: "US$388" },
    { id: "detroit", label: "Detroit", price: "US$267" },
    { id: "raleigh", label: "Raleigh", price: "US$399" },
    { id: "dallas", label: "Dallas", price: "US$267" },
    { id: "chicago", label: "Chicago", price: "US$267" },
    { id: "houston", label: "Houston", price: "US$329" },
    { id: "nashville", label: "Nashville", price: "US$410" },
    { id: "atlanta", label: "Atlanta", price: "US$489" },
    { id: "boston", label: "Boston", price: "US$520" },
    { id: "tampa", label: "Tampa", price: "US$571" },
  ];

  return (
    <FilterSection title="Stopover cities" collapsible defaultOpen className="mb-4">
      <div className="space-y-1">
        {cities.map((city) => (
          <FilterCheckboxRow
            key={city.id}
            label={city.label}
            price={city.price}
            checked={!!selected[city.id]}
            onCheckedChange={() =>
              setSelected((prev) => ({ ...prev, [city.id]: !prev[city.id] }))
            }
          />
        ))}
      </div>
    </FilterSection>
  );
}

export default StopoverCitiesSection;
