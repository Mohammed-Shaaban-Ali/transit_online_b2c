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
    <div className="flex flex-col gap-4">
      {label && date && (
        <div className="flex items-center gap-3">
          <span className="rounded bg-[#0f2a54] text-white px-2.5 py-0.5 text-[15px] font-semibold">
            {label}
          </span>
          <p className="text-[14px] text-gray-500">
            {date}&nbsp;&nbsp;|&nbsp;&nbsp;Duration {totalDuration}
          </p>
        </div>
      )}

      <div className="grid grid-cols-[50px_3px_1fr] gap-x-3">
        {rows.map((row, i) => {
          if (row.type === "airport") {
            return (
              <React.Fragment key={i}>
                <p className="text-[15px] font-bold text-gray-800 leading-snug self-center">
                  {row.time}
                </p>
                <div className="bg-gray-300 rounded-full" />
                <p className="text-[14px] font-bold text-gray-800 leading-snug self-center">
                  {row.airport}
                  {row.terminal ? ` ${row.terminal}` : ""}
                </p>
              </React.Fragment>
            );
          }

          if (row.type === "flight") {
            return (
              <React.Fragment key={i}>
                <div className="flex justify-center py-2">
                  {row.logo ? (
                    <img
                      src={row.logo}
                      alt={row.airlineName}
                      width={22}
                      height={22}
                      className="rounded object-contain"
                    />
                  ) : (
                    <div className="size-[22px] rounded bg-gray-200" />
                  )}
                </div>
                <div className="bg-gray-300 rounded-full" />
                <div className="flex flex-col justify-center py-2">
                  <p className="text-[13px] text-gray-500 leading-snug">
                    {row.airlineName} {row.flightNum}
                  </p>
                  <p className="text-[13px] text-gray-500 leading-snug">
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
                <div className="flex items-center py-3.5">
                  <span className="text-[12px] text-gray-500 border border-gray-200 rounded-sm px-3 py-1">
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
