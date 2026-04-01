import React from "react";
import type { Leg } from "@/types/flightTypes";
import { useTranslations } from "next-intl";
import { useFlightUtils } from "@/hooks/useFlightUtils";

function getLegDurationMinutes(leg: Leg) {
  return leg.time_info?.leg_duration_time_minute ?? 0;
}

function getTotalTripMinutes(legs: Leg[]) {
  return legs.reduce((sum, leg, idx) => {
    const legMin = getLegDurationMinutes(leg);
    const waitMin =
      idx < legs.length - 1
        ? (leg.time_info?.wait_time_in_minute_before_next_leg ?? 0)
        : 0;
    return sum + legMin + waitMin;
  }, 0);
}

type RowItem =
  | {
      type: "airport";
      dateTime: string;
      airport: string;
      terminal?: string;
    }
  | {
      type: "flight";
      logo?: string;
      airlineName: string;
      flightNum: string;
      durationMinutes: number;
    }
  | { type: "transfer"; layoverMinutes: number; cityName: string };

function buildRows(legs: Leg[]): RowItem[] {
  const rows: RowItem[] = [];
  legs.forEach((leg, i) => {
    rows.push({
      type: "airport",
      dateTime: leg.departure_info.date,
      airport: leg.departure_info.airport_name,
      terminal: leg.departure_info.terminal_no,
    });
    rows.push({
      type: "flight",
      logo: leg.airline_info?.logo,
      airlineName: leg.airline_info?.carrier_name || "Airline",
      flightNum: `${leg.airline_info?.carrier_code || ""}${leg.flight_number || ""}`,
      durationMinutes: getLegDurationMinutes(leg),
    });
    rows.push({
      type: "airport",
      dateTime: leg.arrival_info.date,
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
  const t = useTranslations("ShowFarePage.FareDialog");
  const { formatTime, formatDuration } = useFlightUtils();
  const totalDuration = formatDuration(getTotalTripMinutes(legs));
  const rows = buildRows(legs);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {label && date && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="rounded bg-[#0f2a54] px-2 py-0.5 text-[12px] font-semibold text-white sm:px-2.5 sm:text-[15px]">
            {label === "Depart" ? t("depart") : t("return")}
          </span>
          <p className="min-w-0 text-[12px] text-gray-500 sm:text-[14px]">
            {date}&nbsp;&nbsp;|&nbsp;&nbsp;{t("duration")} {totalDuration}
          </p>
        </div>
      )}

      <div className="grid grid-cols-[42px_3px_1fr] gap-x-2 sm:grid-cols-[50px_3px_1fr] sm:gap-x-3">
        {rows.map((row, i) => {
          if (row.type === "airport") {
            return (
              <React.Fragment key={i}>
                <p className="self-center text-[13px] font-bold leading-snug text-gray-800 tabular-nums sm:text-[15px]">
                  {formatTime(row.dateTime)}
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
                    {t("flightTime")}: {formatDuration(row.durationMinutes)}
                  </p>
                </div>
              </React.Fragment>
            );
          }

          if (row.type === "transfer") {
            const layoverText = t("transferIn", {
              city: row.cityName,
              time: formatDuration(row.layoverMinutes),
            });
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
                    {layoverText}
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
