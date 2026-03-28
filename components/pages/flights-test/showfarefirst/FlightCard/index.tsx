import { ChevronRight, Users } from "lucide-react";
import Image from "next/image";
import airportImage from "@/public/images/flights/airport.webp";
import FlightAmenities from "./FlightAmenities";
import FlightTimeline from "./FlightTimeline";
import { FlightDirection } from "@/types/flightTypes";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { formatePrice } from "@/utils/formatePrice";

type Props = {
  flightData: FlightDirection;
  /** Round-trip: first step — pick outbound only (shows return list). */
  onSelectDeparture?: (flight: FlightDirection) => void;
  /** One-way or return leg — open fare dialog & fetch packages. */
  onOpenFare?: (flight: FlightDirection) => void;
  isReturn?: boolean;
  selectedDepartureData?: FlightDirection | null;
};

function FlightCard({
  flightData,
  onSelectDeparture,
  onOpenFare,
  isReturn,
  selectedDepartureData,
}: Props) {
  const firstLeg = flightData.legs?.[0];
  const lastLeg = flightData.legs?.[flightData.legs.length - 1];
  if (!firstLeg) return null;

  const airlineName = firstLeg.airline_info?.carrier_name || "Airline";
  const flightNumber = `${firstLeg.airline_info?.carrier_code || ""}${firstLeg.flight_number || ""}`;

  const depTime = firstLeg.departure_info?.date
    ? new Date(firstLeg.departure_info.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "--:--";
  const arrTime = lastLeg?.arrival_info?.date
    ? new Date(lastLeg.arrival_info.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "--:--";

  const depCode = firstLeg.departure_info?.airport_code || "---";
  const arrCode = lastLeg?.arrival_info?.airport_code || "---";
  const depAirport = firstLeg.departure_info?.airport_name || depCode;
  const arrAirport = lastLeg?.arrival_info?.airport_name || arrCode;

  const totalMinutes =
    (firstLeg.time_info?.flight_time_hour || 0) * 60 +
    (firstLeg.time_info?.flight_time_minute || 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const duration = `${hours}h ${minutes}m`;

  const stopsCount = (flightData.legs?.length || 1) - 1;
  const stopsText =
    stopsCount === 0
      ? "Nonstop"
      : stopsCount === 1
        ? "1 Stop"
        : `${stopsCount} Stops`;

  const priceSAR = isReturn
    ? (flightData?.fares?.[0]?.fare_info?.fare_detail?.price_info?.total_fare ||
        0) +
      Number(
        selectedDepartureData?.fares?.[0]?.fare_info?.fare_detail?.price_info
          ?.total_fare || 0,
      ) -
      Number(selectedDepartureData?.minimum_package_price || 0)
    : flightData.minimum_package_price || 0;
  const displayPrice = formatePrice(priceSAR);
  const cabinClass = firstLeg.airline_info?.carrier_name ? "Economy class" : "";

  const airlineLogo = firstLeg.airline_info?.logo || airportImage;

  return (
    <article className="flex items-center gap-10 px-5 py-4 bg-white">
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex size-10 items-center justify-center shrink-0">
          {typeof airlineLogo === "string" ? (
            <img
              src={airlineLogo}
              alt={airlineName}
              width={40}
              height={40}
              className="rounded"
            />
          ) : (
            <Image src={airlineLogo} alt={airlineName} width={40} height={40} />
          )}
        </div>
        <div>
          <p className="text-[14px]">{airlineName}</p>
          <FlightAmenities
            airline={airlineName}
            cabinClass={cabinClass}
            airlineLogo={airportImage}
          />
        </div>
      </div>

      <FlightTimeline
        legs={flightData.legs}
        departureTime={depTime}
        departureCode={depCode}
        departureAirport={depAirport}
        arrivalTime={arrTime}
        arrivalCode={arrCode}
        arrivalAirport={arrAirport}
        duration={duration}
        stops={stopsText}
      />

      <div className="flex items-center gap-4 ms-auto">
        <div className="text-end">
          <div className="text-[20px] font-bold text-primary flex items-center justify-end gap-1 rtl:flex-row-reverse">
            <CurrencySymbol size="lg" />
            <span className="tabular-nums">
              {displayPrice}
              {isReturn ? "+" : ""}
            </span>
          </div>
          <p className="text-[12px] text-primary flex items-center gap-1 fill-primary">
            <Users size={12} fill="currentColor" />
            Exclusive fare
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (onSelectDeparture) {
              onSelectDeparture(flightData);
            } else {
              onOpenFare?.(flightData);
            }
          }}
          className="flex items-center gap-1 h-10 rounded bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer"
        >
          Select <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}

export default FlightCard;
