"use client";

import { useRef, useState } from "react";
import type { FlightDirection } from "@/types/flightTypes";
import FlightLeg from "./FlightLeg";

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getDayDiff(depDate: string, arrDate: string) {
  const dep = new Date(depDate);
  const arr = new Date(arrDate);
  dep.setHours(0, 0, 0, 0);
  arr.setHours(0, 0, 0, 0);
  return Math.round((arr.getTime() - dep.getTime()) / 86400000);
}

function formatTotalDuration(legs: FlightDirection["legs"]) {
  const firstDep = new Date(legs[0].departure_info.date).getTime();
  const lastArr = new Date(legs[legs.length - 1].arrival_info.date).getTime();
  const totalMin = Math.round((lastArr - firstDep) / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

function FlightDetailPanel({
  flight,
  isExpanded,
}: {
  flight: FlightDirection;
  isExpanded: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      style={{
        maxHeight: isExpanded
          ? `${ref.current?.scrollHeight ?? 2000}px`
          : "0px",
      }}
      className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
    >
      <div className="px-4 pb-4 pt-2">
        <FlightLeg legs={flight.legs} />
      </div>
    </div>
  );
}

type Props = {
  flights: FlightDirection[];
};

export default function FlightItineraryRow({ flights }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(flights, "flights");
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* ── Each flight: summary row + its detail panel ── */}
      <div className="flex">
        {/* Left: stacked flight rows with their detail panels */}
        <div className="flex-1 divide-y divide-gray-100">
          {flights.map((flight, idx) => {
            const firstLeg = flight.legs[0];
            const lastLeg = flight.legs[flight.legs.length - 1];

            const logo = firstLeg.airline_info?.logo;
            const carrierName = firstLeg.airline_info?.carrier_name || "";
            const fromCity = firstLeg.departure_info.city_name;
            const fromCode = firstLeg.departure_info.airport_code;
            const toCity = lastLeg.arrival_info.city_name;
            const toCode = lastLeg.arrival_info.airport_code;
            const date = formatShortDate(firstLeg.departure_info.date);
            const duration = formatTotalDuration(flight.legs);
            const dayDiff = getDayDiff(
              firstLeg.departure_info.date,
              lastLeg.arrival_info.date,
            );
            const stopCount = flight.legs.length - 1;

            return (
              <div key={idx}>
                {/* Summary row */}
                <div className="flex items-center gap-3 px-4 py-3.5 flex-wrap">
                  <div className="shrink-0 size-8 flex items-center justify-center">
                    {logo ? (
                      <img
                        src={logo}
                        alt={carrierName}
                        width={32}
                        height={32}
                        className="rounded object-contain"
                      />
                    ) : (
                      <div className="size-8 rounded bg-gray-200" />
                    )}
                  </div>

                  <span className="text-[14px] font-semibold text-gray-800 whitespace-nowrap">
                    {fromCity} ({fromCode})&nbsp;&nbsp;→&nbsp;&nbsp;{toCity} (
                    {toCode})
                  </span>

                  <span className="text-gray-300 select-none">|</span>

                  <span className="text-[13px] text-gray-500 whitespace-nowrap">
                    {date}
                  </span>

                  <span className="text-gray-300 select-none">|</span>

                  <span className="text-[13px] text-gray-500 whitespace-nowrap">
                    Duration {duration}
                  </span>

                  {stopCount > 0 && (
                    <>
                      <span className="text-gray-300 select-none">|</span>
                      <span className="text-[13px] text-gray-500 whitespace-nowrap">
                        {stopCount === 1 ? "1 stop" : `${stopCount} stops`}
                      </span>
                    </>
                  )}
                </div>

                {/* Detail panel — slides in directly below its own summary row */}
                <FlightDetailPanel flight={flight} isExpanded={isExpanded} />
              </div>
            );
          })}
        </div>

        {/* Right: single toggle button centred across all rows */}
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
          className="shrink-0 self-stretch flex items-center justify-center px-4 border-l border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="8 12 12 16 16 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
