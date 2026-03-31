import React from "react";
import type { Leg } from "@/types/flightTypes";

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatLegDuration(leg: Leg) {
  const h = leg.time_info?.flight_time_hour || 0;
  const m = leg.time_info?.flight_time_minute || 0;
  return `${h}h ${m}m`;
}

function formatLayover(minutes: number, cityName: string) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const time = h > 0 ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m}m`;
  return `Transfer in ${cityName} ${time}`;
}

function formatTotalDuration(legs: Leg[]) {
  const firstDep = new Date(legs[0].departure_info.date).getTime();
  const lastArr = new Date(legs[legs.length - 1].arrival_info.date).getTime();
  const totalMin = Math.round((lastArr - firstDep) / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

type RowItem =
  | { type: "airport"; time: string; airport: string; terminal?: string }
  | {
      type: "flight";
      logo?: string;
      airlineName: string;
      flightNum: string;
      duration: string;
    }
  | { type: "transfer"; layoverMinutes: number; cityName: string };

function buildRows(legs: Leg[]): RowItem[] {
  const rows: RowItem[] = [];
  legs.forEach((leg, i) => {
    rows.push({
      type: "airport",
      time: formatTime(leg.departure_info.date),
      airport: leg.departure_info.airport_name,
      terminal: leg.departure_info.terminal_no,
    });
    rows.push({
      type: "flight",
      logo: leg.airline_info?.logo,
      airlineName: leg.airline_info?.carrier_name || "Airline",
      flightNum: `${leg.airline_info?.carrier_code || ""}${leg.flight_number || ""}`,
      duration: formatLegDuration(leg),
    });
    rows.push({
      type: "airport",
      time: formatTime(leg.arrival_info.date),
      airport: leg.arrival_info.airport_name,
      terminal: leg.arrival_info.terminal_no,
    });
    const layover = leg.time_info?.wait_time_in_minute_before_next_leg || 0;
    if (legs[i + 1] && layover > 0) {
      rows.push({
        type: "transfer",
        layoverMinutes: layover,
        cityName: leg.arrival_info.city_name || leg.arrival_info.airport_name,
      });
    }
  });
  return rows;
}

function FlightLeg({
  legs,
  label,
  date,
}: {
  legs: Leg[];
  label?: "Depart" | "Return";
  date?: string;
}) {
  const totalDuration = formatTotalDuration(legs);
  const rows = buildRows(legs);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {label && date && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="rounded bg-[#0f2a54] px-2 py-0.5 text-[12px] font-semibold text-white sm:px-2.5 sm:text-[15px]">
            {label}
          </span>
          <p className="min-w-0 text-[12px] text-gray-500 sm:text-[14px]">
            {date}&nbsp;&nbsp;|&nbsp;&nbsp;Duration {totalDuration}
          </p>
        </div>
      )}

      <div className="grid grid-cols-[42px_3px_1fr] gap-x-2 sm:grid-cols-[50px_3px_1fr] sm:gap-x-3">
        {rows.map((row, i) => {
          if (row.type === "airport") {
            return (
              <React.Fragment key={i}>
                <p className="self-center text-[13px] font-bold leading-snug text-gray-800 tabular-nums sm:text-[15px]">
                  {row.time}
                </p>
                <div className="rounded-full bg-gray-300" />
                <p className="self-center text-[12px] font-bold leading-snug text-gray-800 sm:text-[14px]">
                  {row.airport}
                  {row.terminal ? ` ${row.terminal}` : ""}
                </p>
              </React.Fragment>
            );
          }

          if (row.type === "flight") {
            return (
              <React.Fragment key={i}>
                <div className="flex justify-center py-1.5 sm:py-2">
                  {row.logo ? (
                    <img
                      src={row.logo}
                      alt={row.airlineName}
                      width={22}
                      height={22}
                      className="size-[20px] rounded object-contain sm:size-[22px]"
                    />
                  ) : (
                    <div className="size-5 rounded bg-gray-200 sm:size-[22px]" />
                  )}
                </div>
                <div className="rounded-full bg-gray-300" />
                <div className="flex flex-col justify-center py-1.5 sm:py-2">
                  <p className="text-[12px] leading-snug text-gray-500 sm:text-[13px]">
                    {row.airlineName} {row.flightNum}
                  </p>
                  <p className="text-[12px] leading-snug text-gray-500 sm:text-[13px]">
                    Flight time: {row.duration}
                  </p>
                </div>
              </React.Fragment>
            );
          }

          if (row.type === "transfer") {
            return (
              <React.Fragment key={i}>
                <div />
                <div className="relative bg-gray-300 rounded-full">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-5 rounded-full bg-gray-200 flex items-center justify-center z-10">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </span>
                </div>
                <div className="flex items-center py-2.5 sm:py-3.5">
                  <span className="rounded-sm border border-gray-200 px-2 py-0.5 text-[11px] text-gray-500 sm:px-3 sm:py-1 sm:text-[12px]">
                    {formatLayover(row.layoverMinutes, row.cityName)}
                  </span>
                </div>
              </React.Fragment>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

export default FlightLeg;
