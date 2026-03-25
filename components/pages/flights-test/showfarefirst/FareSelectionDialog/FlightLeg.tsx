import React from "react";
import { FlightData } from "../data/flights";
import Image from "next/image";
import airportImage from "@/public/images/flights/airport.webp";

type Props = {};

function FlightLeg({
  flight,
  label,
  date,
}: {
  flight: FlightData;
  label: "Depart" | "Return";
  date: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Badge + meta row */}
      <div className="flex items-center gap-3">
        <span className="rounded bg-[#0f2a54] text-white px-2.5 py-0.5 text-[15px] font-semibold">
          {label}
        </span>
        <p className="text-[14px] text-gray-500">
          {date}&nbsp;&nbsp;|&nbsp;&nbsp;Duration {flight.duration}
        </p>
      </div>

      {/* Timeline: left side (times + logo) | divider | right side (airports + info) */}
      <div className="flex gap-0">
        {/* LEFT: departure time / logo+date / arrival time */}
        <div className="flex flex-col items-center  w-[72px] shrink-0">
          <p className="text-[16px] font-bold leading-tight ">
            {flight.departureTime}
          </p>
          <div className="flex flex-col items-center flex-1 my-1.5">
            <div className="w-px flex-1 bg-gray-300" />
            <div className="flex flex-col items-center my-1">
              <Image
                src={airportImage}
                alt={flight.airline}
                width={26}
                height={26}
                className="rounded shrink-0"
              />
              <p className="text-[10px] text-[#e87722] font-semibold mt-0.5 leading-tight text-center">
                {label === "Depart" ? "Apr 10" : "Apr 13"}
              </p>
            </div>
            <div className="w-px flex-1 bg-gray-300" />
          </div>
          <p className="text-[16px] font-bold leading-tight ">
            {flight.arrivalTime}
          </p>
        </div>

        {/* DIVIDER */}
        <div className="w-1 bg-gray-300 mx-3 self-stretch" />

        {/* RIGHT: departure airport / airline info / arrival airport */}
        <div className="flex flex-col justify-between flex-1 py-0.5">
          <p className="text-[16px] font-bold ">{flight.departureAirport}</p>
          <p className="text-[14px] text-gray-500 my-1 line-clamp-1">
            {flight.airline}&nbsp;&nbsp;{flight.flightNumber}&nbsp;&nbsp;
            {flight.aircraftType ?? "Airbus A320"}&nbsp;&nbsp;
            {flight.cabinClass}
          </p>
          <p className="text-[16px] font-bold ">{flight.arrivalAirport}</p>
        </div>
      </div>
    </div>
  );
}

export default FlightLeg;
