"use client";

import { useState } from "react";
import FilterCheckboxRow from "../FilterCheckboxRow";
import FilterSection from "../components/FilterSection";

type AirportItem = {
  code: string;
  name: string;
  count: number;
};

type Props = {
  departureAirports: AirportItem[];
  arrivalAirports: AirportItem[];
};

function AirportsSection({ departureAirports, arrivalAirports }: Props) {
  const [selectedDep, setSelectedDep] = useState<string[]>([]);
  const [selectedArr, setSelectedArr] = useState<string[]>([]);

  const toggleDep = (code: string) =>
    setSelectedDep((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );

  const toggleArr = (code: string) =>
    setSelectedArr((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );

  if (!departureAirports.length && !arrivalAirports.length) return null;

  return (
    <FilterSection title="Airports" collapsible defaultOpen className="mb-4">
      {departureAirports.length > 0 && (
        <div className="mb-3">
          <h5 className="mb-1 px-2 text-[14px] font-medium">Departure Airport</h5>
          <div className="space-y-1">
            {departureAirports.map((a) => (
              <FilterCheckboxRow
                key={`dep-${a.code}`}
                label={`${a.code} ${a.name} (${a.count})`}
                checked={selectedDep.includes(a.code)}
                onCheckedChange={() => toggleDep(a.code)}
              />
            ))}
          </div>
        </div>
      )}

      {arrivalAirports.length > 0 && (
        <div>
          <h5 className="mb-1 px-2 text-[14px] font-medium">Arrival Airport</h5>
          <div className="space-y-1">
            {arrivalAirports.map((a) => (
              <FilterCheckboxRow
                key={`arr-${a.code}`}
                label={`${a.code} ${a.name} (${a.count})`}
                checked={selectedArr.includes(a.code)}
                onCheckedChange={() => toggleArr(a.code)}
              />
            ))}
          </div>
        </div>
      )}
    </FilterSection>
  );
}

export default AirportsSection;
