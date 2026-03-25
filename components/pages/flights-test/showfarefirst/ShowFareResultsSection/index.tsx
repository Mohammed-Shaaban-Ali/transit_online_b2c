"use client";

import { useState } from "react";
import ShowFareFilters from "./ShowFareFilters/index";
import QuickFilter from "./QuickFilter";
import FlightCard from "../FlightCard";
import FareSelectionDialog from "../FareSelectionDialog";
import FlightSectionHeader from "./FlightSectionHeader";
import { departureFlights, returnFlights } from "../data/flights";
import type { FlightData, FareOption } from "../data/flights";
import headerImage from "@/public/images/flights/headerImage.jpg";
type SelectedFlight = {
  flight: FlightData;
  from: string;
  to: string;
  date: string;
  timeRange: string;
  stops: string;
};

function ShowFareResultsSection() {
  const [selectedDeparture, setSelectedDeparture] =
    useState<SelectedFlight | null>(null);

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    departureFlight: FlightData | null;
    returnFlight: FlightData | null;
  }>({ open: false, departureFlight: null, returnFlight: null });

  const isReturnPhase = selectedDeparture !== null;

  const displayedFlights = isReturnPhase ? returnFlights : departureFlights;

  const handleSelectDeparture = (flight: FlightData) => {
    setSelectedDeparture({
      flight,
      from: flight.departureAirport.split(" ")[0],
      to: flight.arrivalAirport.split(" ")[0],
      date: "Fri, Apr 10",
      timeRange: `${flight.departureTime} – ${flight.arrivalTime}`,
      stops: flight.stops,
    });
  };

  const handleSelectReturn = (returnFlight: FlightData) => {
    if (!selectedDeparture) return;
    setDialogState({
      open: true,
      departureFlight: selectedDeparture.flight,
      returnFlight,
    });
  };

  const handleChangeFlight = () => {
    setSelectedDeparture(null);
  };

  const handleDialogClose = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  const handleConfirm = (departureFare: FareOption, returnFare: FareOption) => {
    setDialogState((prev) => ({ ...prev, open: false }));
    // TODO: navigate to booking/checkout with selected fares
    console.log("Selected departure fare:", departureFare);
    console.log("Selected return fare:", returnFare);
  };

  return (
    <>
      <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
        <ShowFareFilters />

        <div className="overflow-hidden rounded-md">
          <FlightSectionHeader
            phase={isReturnPhase ? "return" : "departure"}
            stepNumber={isReturnPhase ? 2 : 1}
            title={
              isReturnPhase
                ? "Returning to New York"
                : "Departures to Miami"
            }
            flightsCount={displayedFlights.length}
            backgroundImage={headerImage}
            selectedDeparture={selectedDeparture}
            onChangeFlight={handleChangeFlight}
          />

          <QuickFilter />

          <div className="space-y-1.5 mt-1.5">
            {displayedFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onSelect={
                  isReturnPhase ? handleSelectReturn : handleSelectDeparture
                }
              />
            ))}
          </div>
        </div>
      </section>

      {dialogState.open &&
        dialogState.departureFlight &&
        dialogState.returnFlight && (
          <FareSelectionDialog
            open={dialogState.open}
            onClose={handleDialogClose}
            departureFlightData={dialogState.departureFlight}
            returnFlightData={dialogState.returnFlight}
            onConfirm={handleConfirm}
          />
        )}
    </>
  );
}

export default ShowFareResultsSection;
