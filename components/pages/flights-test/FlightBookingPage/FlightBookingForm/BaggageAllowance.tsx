"use client";

import Image from "next/image";
import { CircleAlert, User } from "lucide-react";
import type { FlightDirection } from "@/types/flightTypes";
import { useTranslations } from "next-intl";

interface BaggageAllowanceProps {
  flights: FlightDirection[];
}

function getRouteLabel(
  flight: FlightDirection,
  t: ReturnType<typeof useTranslations>,
) {
  const firstLeg = flight.legs?.[0];
  const lastLeg = flight.legs?.[flight.legs.length - 1];

  const fromCity = firstLeg?.departure_info?.city_name || t("departure");
  const toCity = lastLeg?.arrival_info?.city_name || t("arrival");

  return `${fromCity}-${toCity}`;
}

export default function BaggageAllowance({ flights }: BaggageAllowanceProps) {
  const t = useTranslations("FlightBookingPageNested.baggageAllowance");
  const topAllowanceItems = [
    {
      title: t("personalItem"),
      subtitle: t("personalItemSize"),
      imageSrc: "/images/Personal.webp",
      imageAlt: t("personalItem"),
    },
    {
      title: t("carryOnBaggage"),
      subtitle: t("carryOnBaggageSize"),
      imageSrc: "/images/Carry-onbaggage.webp",
      imageAlt: t("carryOnBaggage"),
    },
    {
      title: t("checkedBaggage"),
      subtitle: t("checkedBaggageSize"),
      imageSrc: "/images/Checked baggage.webp",
      imageAlt: t("checkedBaggage"),
    },
  ];

  return (
    <section className="">
      <h3 className="mb-2 text-28 font-bold leading-none ">
        {t("title")}
      </h3>
      <p className="mb-5 text-[14px] text-gray-500">
        <span className="text-primary">✓</span> {t("subtitle")}{" "}
        <button type="button" className="font-medium text-primary">
          {t("baggagePolicies")}
        </button>
      </p>

      <div className="rounded-2xl border border-gray-100 bg-white px-4 pt-6">
        <div className="grid grid-cols-1 gap-6 border-b border-gray-200 p-5 text-center md:grid-cols-4">
          <div className=""></div>
          {topAllowanceItems.map((item) => (
            <div key={item.title} className="flex flex-col items-center">
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                width={48}
                height={48}
                className="mb-2 h-[48px] w-auto object-contain"
              />
              <h4 className="text-[16px] font-semibold ">{item.title}</h4>
              <p className="mt-1 max-w-[250px] text-[12px] leading-tight">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

        {flights.map((flight, index) => (
          <div
            key={`${getRouteLabel(flight, t)}-${index}`}
            className={`${index !== 0 ? "border-t border-gray-200" : ""} p-5`}
          >
            <div className="mb-3 text-[14px] font-semibold ">
              {getRouteLabel(flight, t)}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <p className="flex items-center gap-1 text-[14px] font-medium ">
                <User size={14} className="" />
                {t("passenger1")}
              </p>
              <p className="text-[14px]  mx-auto text-center ">
                {t("carryOnAllowance")}
              </p>
              <p className="text-[14px] font-medium leading-snug mx-auto text-center ">
                {t("personalItemAllowance")}
              </p>
              <p className="flex items-center gap-1 text-[14px]  mx-auto">
                {t("checkedPieces")}
                <CircleAlert size={18} className="" />
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
