import React from "react";
import Image from "next/image";
import partnerAirlinesImage from "@/public/images/flights/airport.webp";
import { IoChevronForward } from "react-icons/io5";
import { useTranslations } from "next-intl";
type Props = {};

const partnerFlights = [
  {
    id: 1,
    airline: "American Airlines",
    route: "New York ⇌ Miami",
    date: "Wed, May 13 - Wed, May 20",
    price: "US$277",
  },
  {
    id: 2,
    airline: "American Airlines",
    route: "New York ⇌ London",
    date: "Thu, May 21 - Fri, May 29",
    price: "US$1,006",
  },
  {
    id: 3,
    airline: "Cathay Pacific",
    route: "Hong Kong ⇌ Bangkok",
    date: "Tue, Mar 24 - Tue, Mar 31",
    price: "US$284",
  },
  {
    id: 4,
    airline: "Cathay Pacific",
    route: "Taipei ⇌ Hong Kong",
    date: "Sun, Apr 19 - Mon, Apr 20",
    price: "US$196",
  },
  {
    id: 5,
    airline: "Cathay Pacific",
    route: "Taipei ⇌ Bangkok",
    date: "Thu, Jun 18 - Mon, Jun 22",
    price: "US$220",
  },
  {
    id: 6,
    airline: "Cathay Pacific",
    route: "Hong Kong ⇌ Seoul",
    date: "Fri, Apr 10 - Thu, Apr 16",
    price: "US$344",
  },
  {
    id: 7,
    airline: "Cathay Pacific",
    route: "New York ⇌ Shanghai",
    date: "Thu, Sep 17 - Thu, Oct 1",
    price: "US$1,278",
  },
  {
    id: 8,
    airline: "Cathay Pacific",
    route: "Hong Kong ⇌ Singapore",
    date: "Sat, May 9 - Sat, May 16",
    price: "US$338",
  },
];

function PartnerAirlines({}: Props) {
  const t = useTranslations("FlightsTestPage.PartnerAirlines");

  return (
    <section className="container max-w-[1200px]! mx-auto py-7">
      <h2 className="mb-6 text-[28px] font-bold leading-tight text-[#151729]">
        {t("title")}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {partnerFlights.map((flight) => (
          <article
            key={flight.id}
            className="rounded-xl cursor-pointer bg-white p-4 
                        hover:shadow-[0_8px_16px_0_rgba(18,24,38,0.08)] transition-all duration-300"
          >
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-full border border-gray-200/70 flex items-center justify-center">
                  <Image
                    src={partnerAirlinesImage}
                    alt={flight.airline}
                    width={24}
                    height={24}
                    className="size-8 rounded-full object-cover"
                  />
                </div>
                <p className="text-[14px] font-medium text-black/80">
                  {flight.airline}
                </p>
              </div>
              <button className="flex items-center gap-0.5 text-[14px] text-primary cursor-pointer hover:underline">
                {t("more")}
                <IoChevronForward className="size-3.5 rtl:rotate-180" />
              </button>
            </div>

            <h3 className="text-[18px] font-bold leading-tight ">
              {flight.route}
            </h3>
            <p className="mt-1.5 text-[14px] text-black/60">{flight.date}</p>
            <p className="mt-1.5 text-[14px] text-black/60">{t("classType")}</p>

            <p className="mt-1.5 text-right text-[14px] text-black/60">
              {t("from")}{" "}
              <span className="text-[18px] font-bold text-black">
                {flight.price}
              </span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PartnerAirlines;
