import { ChevronRight, Users } from "lucide-react";
import Image from "next/image";
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

  const airlineLogo = firstLeg.airline_info?.logo;

  // Day difference between dep and arr for the +N badge
  const dayDiff = (() => {
    if (!firstLeg?.departure_info?.date || !lastLeg?.arrival_info?.date)
      return 0;
    const dep = new Date(firstLeg.departure_info.date);
    const arr = new Date(lastLeg.arrival_info.date);
    dep.setHours(0, 0, 0, 0);
    arr.setHours(0, 0, 0, 0);
    return Math.round((arr.getTime() - dep.getTime()) / 86400000);
  })();

  // Collect all unique airline names across all legs
  const allAirlines = (() => {
    const names: string[] = [];
    for (const leg of flightData.legs || []) {
      const name = leg.airline_info?.carrier_name;
      names.push(name);
    }
    return names;
  })();

  // Availability badge (seats_left or similar)
  const seatsLeft: number | undefined =
    (flightData as any).seats_left ??
    (flightData as any).availability ??
    undefined;
  return (
    <article className="bg-white rounded-2xl sm:rounded-none overflow-hidden">
      {/* ── Mobile layout ── */}
      <div className="flex sm:hidden items-start gap-10 px-4 py-4">
        {/* LEFT: times + airport codes + duration line + airlines */}
        <div className="flex-1 min-w-0">
          {/* Row 1: dep time — line — arr time+badge */}
          <div className="flex items-start gap-2">
            {/* Dep time + code */}
            <div className="shrink-0">
              <p className="text-[26px] font-bold leading-none tabular-nums text-gray-900">
                {depTime}
              </p>
              <p className="mt-[3px] text-[14px] ">{depCode}</p>
            </div>

            {/* Middle: duration + arrow line + stops */}
            <div className="flex flex-1 flex-col items-center pt-2 min-w-0">
              <p className="text-[11px] text-gray-400 leading-none">
                {duration}
              </p>
              <div className="relative flex w-full items-center my-1">
                <span className="size-[5px] shrink-0 rounded-full bg-gray-400" />
                <div className="relative flex-1 h-px bg-gray-300">
                  {stopsCount > 0 &&
                    Array.from({ length: stopsCount }).map((_, i) => (
                      <span
                        key={i}
                        className="absolute top-1/2 size-[5px] -translate-y-1/2 -translate-x-1/2 border border-gray-400 bg-white"
                        style={{
                          left: `${((i + 1) / (stopsCount + 1)) * 100}%`,
                        }}
                      />
                    ))}
                </div>
                {/* Arrow head */}
                <ChevronRight
                  size={12}
                  className="-ml-1 shrink-0 text-gray-400"
                  strokeWidth={2.5}
                />
              </div>
              <p className="text-[11px] text-gray-400 leading-none">
                {stopsText}
              </p>
            </div>

            {/* Arr time + day badge + code */}
            <div className="shrink-0 text-right">
              <p className="text-[26px] font-bold leading-none tabular-nums text-gray-900">
                {arrTime}
                {dayDiff > 0 && (
                  <sup className="ml-0.5 text-[13px] font-semibold text-orange-500 align-super">
                    +{dayDiff}
                  </sup>
                )}
              </p>
              <p className="mt-[3px] text-[14px] text-right">{arrCode}</p>
            </div>
          </div>

          {/* Row 2: airline names */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-1 gap-y-0.5">
            {airlineLogo && (
              <img
                src={airlineLogo}
                alt={allAirlines[0] ?? airlineName}
                width={16}
                height={16}
                className="shrink-0 rounded"
              />
            )}
            {allAirlines.map((name, i) => (
              <span key={name} className="text-[14px] text-gray-400">
                {i > 0 && (
                  <span className="mx-1 text-gray-300 select-none">|</span>
                )}
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: price + availability */}
        <div className="shrink-0 flex flex-col items-end justify-start gap-1 pl-2">
          <div className="flex items-baseline gap-0.5 tabular-nums text-[22px] font-bold text-primary leading-none">
            <CurrencySymbol size="lg" />
            <span className="">
              {displayPrice}
              {isReturn ? "+" : ""}
            </span>
          </div>
          {seatsLeft !== undefined && seatsLeft < 5 ? (
            <p className="text-[12px] font-medium text-red-500">
              &lt;{seatsLeft} left
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => {
              if (onSelectDeparture) {
                onSelectDeparture(flightData);
              } else {
                onOpenFare?.(flightData);
              }
            }}
            className="mt-2 flex items-center gap-0.5 h-8 rounded-lg bg-primary px-3.5 text-[12px] font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer"
          >
            Select <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex items-center gap-10 px-5 py-4">
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="flex size-10 items-center justify-center shrink-0">
            {airlineLogo && (
              <img
                src={airlineLogo}
                alt={airlineName}
                width={40}
                height={40}
                className="rounded"
              />
            )}
          </div>
          <div>
            <p className="text-[14px]">{airlineName}</p>
            <FlightAmenities
              airline={airlineName}
              cabinClass={cabinClass}
              airlineLogo={airlineLogo || ""}
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
      </div>
    </article>
  );
}

export default FlightCard;
