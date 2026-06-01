import FloatingSideActions from "@/components/pages/flights-test/FloatingSideActions";
import StaticFlightSearchBox from "@/components/pages/flights-test/FlightsTestHero/Form/StaticFlightSearchBox";
import FareDateSlider from "@/components/pages/flights-test/showfarefirst/FareDateSlider";
import ShowFareResultsSection from "@/components/pages/flights-test/showfarefirst/ShowFareResultsSection";
import type { TripType } from "@/components/pages/flights-test/FlightsTestHero/Form/types";
import React from "react";
import heroImage from "@/public/images/flights/flight_home_bg_v6.webp";
import Image from "next/image";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const getParam = (
  params: Record<string, string | string[] | undefined>,
  key: string,
) => {
  const value = params[key];
  if (Array.isArray(value)) return value[0];
  return value;
};

async function page({ searchParams }: Props) {
  const params = (await searchParams) || {};

  const fromAirport = getParam(params, "from") || "";
  const toAirport = getParam(params, "to") || "";
  const departureDate = getParam(params, "departureDate") || "";
  const returnDate = getParam(params, "returnDate") || "";
  const adults = Number(getParam(params, "adults") || 1);
  const children = Number(getParam(params, "children") || 0);
  const infants = Number(getParam(params, "infants") || 0);
  const nonstop = getParam(params, "nonstop") !== "false";

  const parsedTripType = getParam(params, "tripType");
  const tripType =
    parsedTripType === "roundTrip" ||
    parsedTripType === "oneWay" ||
    parsedTripType === "multiCity"
      ? parsedTripType
      : "roundTrip";

  const parsedCabinClass = getParam(params, "cabinClass");
  const cabinClass = parsedCabinClass === "BUSINESS" ? "BUSINESS" : "ECONOMY";

  const hasSearchParams = !!(fromAirport && toAirport && departureDate);

  const searchInitial = {
    fromAirport,
    toAirport,
    tripType: tripType as TripType,
    nonstop,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    cabinClass: cabinClass as "ECONOMY" | "BUSINESS",
  };

  return (
    <>
      <NewNavbar />
      <section className="relative bg-[#ebedf1] md:bg-primary">
        <FloatingSideActions />

        {/* Mobile: hero image + fade (like FlightsTestHero), form in flow so filters sit below */}
        <div className="relative md:hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(200px,42vw)]">
            <Image
              src={heroImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-top"
              priority
            />
            <div
              className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#ebedf1] via-[#ebedf1]/60 to-transparent"
              aria-hidden
            />
          </div>
          <div className="relative z-10 flex flex-col px-3 pb-5 pt-28 sm:px-4 sm:pb-6 sm:pt-11">
            <div
              className="overflow-hidden rounded-2xl bg-white text-[15px] antialiased [text-size-adjust:100%]"
              style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.14)" }}
            >
              <StaticFlightSearchBox
                compactActions
                className="mt-0 rounded-none shadow-none"
                initialValues={searchInitial}
              />
            </div>
          </div>
        </div>

        {/* Desktop: original primary strip + overlapping search card */}
        <div className="relative hidden h-[170px] w-full bg-primary md:block">
          <div className="absolute left-1/2 top-full z-20 w-full max-w-[1200px] -translate-x-1/2 -translate-y-1/2 ">
            <StaticFlightSearchBox
              compactActions
              className="mt-0 rounded-[8px] shadow-[0_10px_24px_rgba(17,24,39,0.1)]"
              initialValues={searchInitial}
            />
          </div>
        </div>

        <section
          className="relative z-0 min-h-screen 
      rounded-t-[32px] bg-[#ebedf1]  md:pt-24"
        >
          <div className="mx-auto w-full max-w-[1200px] px-2 sm:px-5 md:px-0">
            {hasSearchParams && (
              <>
                {/* <FareDateSlider
                  departureDate={departureDate}
                  returnDate={returnDate}
                  tripType={tripType}
                  searchParams={{
                    from: fromAirport,
                    to: toAirport,
                    tripType,
                    nonstop: String(nonstop),
                    adults: String(adults),
                    children: String(children),
                    infants: String(infants),
                    cabinClass,
                  }}
                /> */}
                <ShowFareResultsSection
                  fromAirport={fromAirport}
                  toAirport={toAirport}
                  departureDate={departureDate}
                  returnDate={returnDate}
                  adults={adults}
                  children={children}
                  infants={infants}
                  cabinClass={cabinClass}
                  nonstop={nonstop}
                />
              </>
            )}
          </div>
        </section>
      </section>
    </>
  );
}

export default page;
