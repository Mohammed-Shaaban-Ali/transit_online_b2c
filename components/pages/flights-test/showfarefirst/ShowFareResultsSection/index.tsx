"use client";

import { useState } from "react";
import ShowFareFilters from "./ShowFareFilters/index";
import QuickFilter from "./QuickFilter";
import FlightCard from "../FlightCard";
import SelectedFlightSummary from "./SelectedFlightSummary";

type SelectedFlight = {
  from: string;
  to: string;
  date: string;
  timeRange: string;
  stops: string;
};

function ShowFareResultsSection() {
  const [selectedDeparture, setSelectedDeparture] =
    useState<SelectedFlight | null>(null);

  const handleSelectFlight = () => {
    setSelectedDeparture({
      from: "New York",
      to: "Miami",
      date: "Fri, Apr 10",
      timeRange: "06:30 –15:00",
      stops: "1 stop",
    });
  };

  const handleChangeFlight = () => {
    setSelectedDeparture(null);
  };

  const isReturnPhase = selectedDeparture !== null;

  return (
    <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
      <ShowFareFilters />

      <div className="overflow-hidden rounded-md">
        <div className="bg-[#0f2a54] px-5 py-4 text-white ">
          {isReturnPhase && (
            <SelectedFlightSummary
              direction="Depart"
              from={selectedDeparture.from}
              to={selectedDeparture.to}
              date={selectedDeparture.date}
              timeRange={selectedDeparture.timeRange}
              stops={selectedDeparture.stops}
              onChangeFlight={handleChangeFlight}
            />
          )}

          <header className={``}>
            <h3 className="text-[18px] font-semibold">
              {isReturnPhase
                ? "Choose your flight from Miami to New York"
                : "Choose your flight from New York to Miami"}
            </h3>
          </header>
        </div>

        <QuickFilter />

        <div className="space-y-1.5 mt-1.5">
          {Array.from({ length: 40 }).map((_, index) => (
            <FlightCard key={index} onSelect={handleSelectFlight} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShowFareResultsSection;
