import { ChevronRight, Users } from "lucide-react";
import Image from "next/image";
import airportImage from "@/public/images/flights/airport.webp";
import FlightAmenities from "./FlightAmenities";
import FlightTimeline from "./FlightTimeline";
import type { FlightData } from "../data/flights";

type Props = {
  flight: FlightData;
  onSelect?: (flight: FlightData) => void;
};

function FlightCard({ flight, onSelect }: Props) {
  return (
    <article
      className="flex items-center gap-10
      px-5 py-4 bg-white"
    >
      {/* Airline */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex size-10 items-center justify-center shrink-0">
          <Image src={airportImage} alt={flight.airline} width={40} height={40} />
        </div>
        <div>
          <p className="text-[14px]">{flight.airline}</p>
          <FlightAmenities
            airline={flight.airline}
            cabinClass={flight.cabinClass}
            airlineLogo={airportImage}
          />
        </div>
      </div>

      {/* Flight times */}
      <FlightTimeline
        departureTime={flight.departureTime}
        departureCode={flight.departureCode}
        departureAirport={flight.departureAirport}
        arrivalTime={flight.arrivalTime}
        arrivalCode={flight.arrivalCode}
        arrivalAirport={flight.arrivalAirport}
        duration={flight.duration}
        stops={flight.stops}
        airline={flight.airline}
        flightNumber={flight.flightNumber}
        airlineLogo={airportImage}
      />

      {/* Price & Select */}
      <div className="flex items-center gap-4 ms-auto">
        <div className="text-end">
          <p className="text-[20px] font-bold text-gray-900">
            {flight.currency}{flight.price}
          </p>
          {flight.exclusive && (
            <p className="text-[14px] text-primary font-medium flex items-center justify-end gap-1">
              <Users size={14} className="fill-primary" /> Exclusive fare
            </p>
          )}
          <p className="text-[14px] text-gray-500">Round-trip</p>
        </div>
        <button
          type="button"
          onClick={() => onSelect?.(flight)}
          className="flex items-center gap-1 h-10 rounded bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer"
        >
          Select <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}

export default FlightCard;
