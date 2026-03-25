import Image, { StaticImageData } from "next/image";
import SelectedFlightSummary from "../SelectedFlightSummary";

type SelectedFlight = {
  from: string;
  to: string;
  date: string;
  timeRange: string;
  stops: string;
};

type Props = {
  phase: "departure" | "return";
  stepNumber: number;
  title: string;
  flightsCount: number;
  selectedDeparture?: SelectedFlight | null;
  onChangeFlight?: () => void;
  backgroundImage: StaticImageData | string;
};

export default function FlightSectionHeader({
  phase,
  stepNumber,
  title,
  flightsCount,
  selectedDeparture,
  onChangeFlight,
  backgroundImage,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-t-md">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="header background"
          fill
          className="object-cover object-center"
          priority
        />
        <div
          className="absolute inset-0 
        bg-linear-to-r from-[#0f2a54]/95 to-primary/95"
        />
      </div>

      <div className="relative z-10 px-5 text-white">
        <div className="flex items-center justify-between py-4">
          <h3 className="text-[18px] font-semibold">
            <span className="mr-1">{stepNumber}.</span>
            {title}
          </h3>
          <span className="text-[14px] text-white/80">
            {flightsCount} flights found
          </span>
        </div>

        {phase === "return" && selectedDeparture && onChangeFlight && (
          <div className="pb-3">
            <SelectedFlightSummary
              direction="Depart"
              from={selectedDeparture.from}
              to={selectedDeparture.to}
              date={selectedDeparture.date}
              timeRange={selectedDeparture.timeRange}
              stops={selectedDeparture.stops}
              onChangeFlight={onChangeFlight}
            />
          </div>
        )}
      </div>
    </div>
  );
}
