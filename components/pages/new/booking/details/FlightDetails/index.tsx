import React from "react";
import {
  BriefcaseBusiness,
  ClipboardList,
  Clock3,
  MapPinned,
} from "lucide-react";
import type { FlightDirection } from "@/types/flightTypes";

type Props = {
  departureFlightData?: FlightDirection | null;
  returnFlightData?: FlightDirection | null;
};

function toTime(input?: string) {
  if (!input) return "--:--";
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return input;
  return parsed.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function toDate(input?: string) {
  if (!input) return "";
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return input;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function toDuration(minutes?: number) {
  if (!minutes || minutes <= 0) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function FlightDetails({ departureFlightData, returnFlightData }: Props) {
  const dynamicLegs = [departureFlightData, returnFlightData]
    .filter(Boolean)
    .map((flight, idx) => {
      const firstLeg = flight!.legs?.[0];
      const lastLeg = flight!.legs?.[flight!.legs.length - 1];
      const segments =
        flight?.legs?.map((segment) => ({
          id: `${segment.flight_number}-${segment.departure_info?.airport_code}-${segment.arrival_info?.airport_code}`,
          departureTime: toTime(segment.departure_info?.date),
          departureCode: segment.departure_info?.airport_code || "",
          departureAirport: `${segment.departure_info?.airport_name || ""} ${segment.departure_info?.terminal_no || ""}`.trim(),
          arrivalTime: toTime(segment.arrival_info?.date),
          arrivalCode: segment.arrival_info?.airport_code || "",
          arrivalAirport: `${segment.arrival_info?.airport_name || ""} ${segment.arrival_info?.terminal_no || ""}`.trim(),
          flightDuration: toDuration(segment.time_info?.leg_duration_time_minute),
          layoverDuration: toDuration(
            segment.time_info?.wait_time_in_minute_before_next_leg,
          ),
          airline: `${segment.airline_info?.carrier_name || ""} ${segment.flight_number || ""}`.trim(),
          classInfo: `Economy class | ${segment.aircraft || "Aircraft"}`,
        })) || [];

      return {
        id: idx === 0 ? "depart" : "return",
        type: idx === 0 ? "Depart" : "Return",
        date: toDate(firstLeg?.departure_info?.date),
        route: `${firstLeg?.departure_info?.city_name || ""} - ${lastLeg?.arrival_info?.city_name || ""}`,
        segments,
      };
    });

  const tripLegs = dynamicLegs.length ? dynamicLegs : [];

  return (
    <section className="space-y-6 bg-white px-6 py-8 rounded">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-24 font-bold leading-none ">Flight Details</h3>

        <div className="flex flex-wrap items-center gap-5 text-14 font-normal text-primary">
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:underline"
          >
            <ClipboardList className="h-4 w-4" />
            <span>Cancellation and change policies</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1  hover:underline"
          >
            <BriefcaseBusiness className="h-4 w-4" />
            <span>Baggage Allowance</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1  hover:underline"
          >
            <MapPinned className="h-4 w-4" />
            <span>Booking info</span>
          </button>
        </div>
      </div>

      <p className="text-15 font-normal text-gray-500">
        All times are in local time
      </p>

      <div className="space-y-6">
        {tripLegs.map((leg, legIndex) => (
          <article
            key={leg.id}
            className={`${legIndex !== 0 ? "border-t border-dashed border-gray-200 pt-6" : ""}`}
          >
            <div className="flex items-center gap-4">
              <span className="inline-flex h-5 items-center rounded bg-primary px-2 text-10 font-bold text-white">
                {leg.type}
              </span>

              <p className="text-18 font-bold leading-none">
                {leg.date}
                <span className="mx-4"> </span>
                {leg.route}
              </p>
            </div>

            <div className="mt-5 space-y-5">
              {leg.segments.map((segment, segmentIndex) => (
                <div
                  key={segment.id}
                  className="grid gap-4 lg:grid-cols-[1fr_380px]"
                >
                  <div className="flex gap-4">
                    <div className="w-[70px] shrink-0 space-y-4 text-end">
                      <p className="text-14 font-normal leading-none text-gray-900">
                        {segment.departureTime}
                      </p>
                      <p className="text-12 font-normal leading-none text-gray-500">
                        {segment.flightDuration}
                      </p>
                      <p className="text-14 font-normal leading-none text-gray-900">
                        {segment.arrivalTime}
                      </p>
                    </div>

                    <div className="mt-1 flex w-[18px] flex-col items-center">
                      <span className="h-3 w-3 bg-gray-300" />
                      <span className="h-12 w-px bg-gray-300" />
                      <span className="h-3 w-3 bg-gray-300" />
                    </div>

                    <div className="space-y-5 flex flex-col justify-between">
                      <p className="text-14 font-normal text-gray-900">
                        <span className="me-3 text-gray-500">
                          {segment.departureCode}
                        </span>
                        {segment.departureAirport}
                      </p>
                      <p className="text-14 font-normal text-gray-900">
                        <span className="me-3 text-gray-500">
                          {segment.arrivalCode}
                        </span>
                        {segment.arrivalAirport}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ms-auto">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <p className="text-14 font-normal leading-none text-gray-900">
                          {segment.airline}
                        </p>
                        <Clock3 className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-16 font-normal text-gray-500">
                        {segment.classInfo}
                      </p>
                    </div>
                  </div>

                  {segmentIndex < leg.segments.length - 1 ? (
                    <div className="col-span-full -mt-1 ps-[92px] text-12 font-medium text-primary">
                      Stop / Layover: {segment.layoverDuration || "N/A"}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FlightDetails;
