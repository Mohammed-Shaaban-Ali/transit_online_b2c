"use client";

import { useState } from "react";
import FilterCheckboxRow from "../FilterCheckboxRow";
import FilterSection from "../components/FilterSection";

function AllianceSection() {
  const [selectedAlliance, setSelectedAlliance] = useState<string>("skyteam");

  return (
    <FilterSection title="Alliance" className="mb-4">
      <div className="space-y-1">
        {[
          { id: "skyteam", name: "SkyTeam", price: "US$149" },
          { id: "oneworld", name: "Oneworld", price: "US$150" },
          { id: "star", name: "Star Alliance", price: "US$197" },
        ].map((item) => (
          <FilterCheckboxRow
            key={item.id}
            label={item.name}
            price={item.price}
            checked={selectedAlliance === item.id}
            onCheckedChange={() => setSelectedAlliance(item.id)}
            activeClassName="text-primary"
          />
        ))}
      </div>
    </FilterSection>
  );
}

export default AllianceSection;
