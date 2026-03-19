"use client";

import { useState } from "react";
import FilterCheckboxRow from "../FilterCheckboxRow";
import FilterSection from "../components/FilterSection";

function AircraftsSection() {
  const [selected, setSelected] = useState({
    large: false,
    midsize: false,
  });

  return (
    <FilterSection title="Aircrafts" collapsible defaultOpen className="mb-4">
      <div className="space-y-1">
        <FilterCheckboxRow
          label="Large aircraft"
          price="US$450"
          checked={selected.large}
          onCheckedChange={() =>
            setSelected((prev) => ({ ...prev, large: !prev.large }))
          }
        />
        <FilterCheckboxRow
          label="Midsize aircraft"
          price="US$222"
          checked={selected.midsize}
          onCheckedChange={() =>
            setSelected((prev) => ({ ...prev, midsize: !prev.midsize }))
          }
        />
      </div>
    </FilterSection>
  );
}

export default AircraftsSection;
