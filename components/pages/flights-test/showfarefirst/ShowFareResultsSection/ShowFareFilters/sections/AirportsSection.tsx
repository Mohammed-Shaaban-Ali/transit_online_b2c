"use client";

import { useState } from "react";
import FilterCheckboxRow from "../FilterCheckboxRow";
import FilterSection from "../components/FilterSection";

function AirportsSection() {
  const [selected, setSelected] = useState({
    ewr: false,
    lga: false,
    jfk: false,
    mia: false,
  });

  return (
    <FilterSection title="Airports" collapsible defaultOpen className="mb-4">
      <div className="mb-3">
        <h5 className="mb-1 px-2 text-[16px] ">Departure Airport</h5>
        <div className="space-y-1">
          <FilterCheckboxRow
            label="EWR Newark Liberty"
            price="US$228"
            checked={selected.ewr}
            onCheckedChange={() =>
              setSelected((prev) => ({ ...prev, ewr: !prev.ewr }))
            }
          />
          <FilterCheckboxRow
            label="LGA LaGuardia Airport"
            price="US$222"
            checked={selected.lga}
            onCheckedChange={() =>
              setSelected((prev) => ({ ...prev, lga: !prev.lga }))
            }
          />
          <FilterCheckboxRow
            label="JFK John F"
            price="US$222"
            checked={selected.jfk}
            onCheckedChange={() =>
              setSelected((prev) => ({ ...prev, jfk: !prev.jfk }))
            }
          />
        </div>
      </div>

      <div>
        <h5 className="mb-1 px-2 text-[16px] ">Arrival Airport</h5>
        <FilterCheckboxRow
          label="MIA Miami International "
          price="US$222"
          checked={selected.mia}
          onCheckedChange={() =>
            setSelected((prev) => ({ ...prev, mia: !prev.mia }))
          }
        />
      </div>
    </FilterSection>
  );
}

export default AirportsSection;
