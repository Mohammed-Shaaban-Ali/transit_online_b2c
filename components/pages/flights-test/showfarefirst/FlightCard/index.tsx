import { ChevronRight, Users } from "lucide-react";
import Image from "next/image";
import airportImage from "@/public/images/flights/airport.webp";
import FlightAmenities from "./FlightAmenities";
import FlightTimeline from "./FlightTimeline";

type Props = {
  onSelect?: () => void;
};

function FlightCard({ onSelect }: Props) {
  return (
    <article
      className="flex items-center gap-10
      px-5 py-4 bg-white"
    >
      {/* Airline */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex size-10 items-center justify-center shrink-0">
          <Image src={airportImage} alt="Airport" width={40} height={40} />
        </div>
        <div>
          <p className="text-[14px] ">Spirit Airlines</p>
          <FlightAmenities
            airline="Spirit Airlines"
            cabinClass="Economy class"
            airlineLogo={airportImage}
          />
        </div>
      </div>

      {/* Flight times */}
      <FlightTimeline
        departureTime="16:13"
        departureCode="EWR B"
        departureAirport="Newark Liberty International Airport B"
        arrivalTime="19:16"
        arrivalCode="MIA"
        arrivalAirport="Miami International Airport"
        duration="3h 3m"
        stops="Nonstop"
        airline="Spirit Airlines"
        flightNumber="NK2890"
        airlineLogo={airportImage}
      />

      {/* Price & Select */}
      <div className="flex items-center gap-4 ms-auto">
        <div className="text-end">
          <p className="text-[20px] font-bold text-gray-900">US$228</p>
          <p className="text-[14px] text-primary font-medium  flex items-center justify-end gap-1">
            <Users size={14} className="fill-primary" /> Exclusive fare
          </p>
          <p className="text-[14px] text-gray-500">Round-trip</p>
        </div>
        <button
          type="button"
          onClick={onSelect}
          className="flex items-center gap-1 h-10 rounded bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer"
        >
          Select <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}

export default FlightCard;
