"use client";

import { ChevronRight, Users } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("ShowFarePage.FlightCard");
  const firstLeg = flightData.legs?.[0];
  const lastLeg = flightData.legs?.[flightData.legs.length - 1];
  if (!firstLeg) return null;

  const airlineName = firstLeg.airline_info?.carrier_name || t("airline");
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
      ? t("nonstop")
      : stopsCount === 1
        ? t("stop")
        : t("stops", { count: stopsCount });

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
  const cabinClass = firstLeg.airline_info?.carrier_name
    ? t("economyClass")
    : "";

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
      {/* ── Mobile layout (compact type scale: times & price dominant, meta smallest) ── */}
      <div className="flex sm:hidden items-start gap-10 px-3 py-3.5">
        {/* LEFT: times + airport codes + duration line + airlines */}
        <div className="min-w-0 flex-1">
          {/* Row 1: dep time — line — arr time+badge */}
          <div className="flex items-start gap-1.5">
            {/* Dep time + code */}
            <div className="shrink-0">
              <p className="text-[21px] font-bold leading-none tabular-nums text-gray-900">
                {depTime}
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-gray-800">
                {depCode}
              </p>
            </div>

            {/* Middle: duration + arrow line + stops */}
            <div className="flex min-w-0 flex-1 flex-col items-center pt-1">
              <p className="text-[10px] leading-none text-gray-400">
                {duration}
              </p>
              <div className="relative my-0.5 flex w-full items-center">
                <span className="size-[4px] shrink-0 rounded-full bg-gray-400" />
                <div className="relative h-px flex-1 bg-gray-300">
                  {stopsCount > 0 &&
                    Array.from({ length: stopsCount }).map((_, i) => (
                      <span
                        key={i}
                        className="absolute top-1/2 size-[4px] -translate-x-1/2 -translate-y-1/2 border border-gray-400 bg-white"
                        style={{
                          left: `${((i + 1) / (stopsCount + 1)) * 100}%`,
                        }}
                      />
                    ))}
                </div>
                <ChevronRight
                  size={11}
                  className="-ml-1 shrink-0 text-gray-400 rtl:rotate-180"
                  strokeWidth={2.5}
                />
              </div>
              <p className="text-[10px] leading-none text-gray-400">
                {stopsText}
              </p>
            </div>

            {/* Arr time + day badge + code */}
            <div className="shrink-0 text-right">
              <p className="text-[21px] font-bold leading-none tabular-nums text-gray-900">
                {arrTime}
                {dayDiff > 0 && (
                  <sup className="ml-0.5 align-super text-[10px] font-semibold text-orange-500">
                    +{dayDiff}
                  </sup>
                )}
              </p>
              <p className="mt-0.5 text-right text-[12px] font-medium text-gray-800">
                {arrCode}
              </p>
            </div>
          </div>

          {/* Row 2: airline names */}
          <div className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-0.5">
            {airlineLogo && (
              <img
                src={airlineLogo}
                alt={allAirlines[0] ?? airlineName}
                width={14}
                height={14}
                className="shrink-0 rounded"
              />
            )}
            {allAirlines.map((name, i) => (
              <span key={name} className="text-[12px] text-gray-500">
                {i > 0 && (
                  <span className="mx-1 text-gray-300 select-none">|</span>
                )}
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: price + availability — aligned with time row; currency slightly smaller than amount */}
        <div className="flex shrink-0 flex-col items-end justify-start gap-0.5 ps-1">
          <div className="flex items-baseline gap-0.5 tabular-nums leading-none text-primary">
            <CurrencySymbol size="md" className="font-bold" />
            <span className="text-[19px] font-bold">
              {displayPrice}
              {isReturn ? "+" : ""}
            </span>
          </div>
          {seatsLeft !== undefined && seatsLeft < 5 ? (
            <p className="text-[11px] font-medium text-red-500">
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
            className="mt-1.5 flex h-7 items-center gap-0.5 rounded-md bg-primary px-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer"
          >
            {t("select")} <ChevronRight size={12} className="rtl:rotate-180" />
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
              {t("exclusiveFare")}
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
            {t("select")} <ChevronRight size={16} className="rtl:rotate-180" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default FlightCard;
