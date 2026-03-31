"use client";

import { FlightFilteringOptions } from "@/types/flightTypes";
import StopsSection from "./sections/StopsSection";
import AirlinesSection from "./sections/AirlinesSection";
import TimesSection from "./sections/TimesSection";
import ProvidersSection from "./sections/ProvidersSection";
import PriceSection from "./sections/PriceSection";

type Props = {
  filteringOptions?: FlightFilteringOptions;
  apiPriceRange: { min: number; max: number };
  flightType?: "departure" | "return";
};

function ShowFareFilters({
  filteringOptions,
  apiPriceRange,
  flightType = "departure",
}: Props) {
  return (
    <aside className="p-1">
      <StopsSection
        stops={filteringOptions?.stops || []}
        flightType={flightType}
      />
      <AirlinesSection
        airlines={filteringOptions?.airline || []}
        flightType={flightType}
      />
      <TimesSection flightType={flightType} />
      {flightType !== "return" && (
        <PriceSection apiPriceRange={apiPriceRange} flightType={flightType} />
      )}
      <ProvidersSection
        providers={filteringOptions?.provider || []}
        flightType={flightType}
      />
    </aside>
  );
}

export default ShowFareFilters;
