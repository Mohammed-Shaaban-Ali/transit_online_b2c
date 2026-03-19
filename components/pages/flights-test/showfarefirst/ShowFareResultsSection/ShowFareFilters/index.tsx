"use client";

import RecommendedSection from "./sections/RecommendedSection";
import AllianceSection from "./sections/AllianceSection";
import AirlinesSection from "./sections/AirlinesSection";
import StopsSection from "./sections/StopsSection";
import TimesSection from "./sections/TimesSection";
import CabinSection from "./sections/CabinSection";
import AircraftsSection from "./sections/AircraftsSection";
import AirportsSection from "./sections/AirportsSection";
import StopoverCitiesSection from "./sections/StopoverCitiesSection";

function ShowFareFilters() {
  return (
    <aside className="p-1">
      <RecommendedSection />
      <AllianceSection />
      <AirlinesSection />
      <StopsSection />
      <TimesSection />
      <StopoverCitiesSection />
      <AirportsSection />
      <AircraftsSection />
      <CabinSection />
    </aside>
  );
}

export default ShowFareFilters;
