import FloatingSideActions from "@/components/pages/flights-test/FloatingSideActions";
import StaticFlightSearchBox from "@/components/pages/flights-test/FlightsTestHero/Form/StaticFlightSearchBox";
import FareDateSlider from "@/components/pages/flights-test/showfarefirst/FareDateSlider";
import ShowFareResultsSection from "@/components/pages/flights-test/showfarefirst/ShowFareResultsSection";
import React from "react";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};
const flightsTestFontFamily =
  '"Trip Geom", BlinkMacSystemFont, -apple-system, Roboto, Helvetica, Arial, sans-serif';

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
  const parsedTripType = getParam(params, "tripType");
  const tripType =
    parsedTripType === "roundTrip" ||
    parsedTripType === "oneWay" ||
    parsedTripType === "multiCity"
      ? parsedTripType
      : "roundTrip";

  const parsedCabinClass = getParam(params, "cabinClass");
  const cabinClass =
    parsedCabinClass === "Business" || parsedCabinClass === "Economy"
      ? parsedCabinClass
      : "Economy";

  return (
    <section
      className="relative bg-primary "
      style={{ fontFamily: flightsTestFontFamily }}
    >
      <FloatingSideActions />

      <div className="relative h-[170px] w-full bg-primary">
        <div className="absolute left-1/2 top-full z-20 w-full max-w-[1200px] -translate-x-1/2 -translate-y-1/2 ">
          <StaticFlightSearchBox
            compactActions
            className="mt-0 rounded-[8px] shadow-[0_10px_24px_rgba(17,24,39,0.1)]"
            initialValues={{
              fromValue: getParam(params, "from") || "",
              toValue: getParam(params, "to") || "",
              tripType,
              nonstop: getParam(params, "nonstop") !== "false",
              departureDate: getParam(params, "departureDate") || "",
              returnDate: getParam(params, "returnDate") || "",
              adults: Number(getParam(params, "adults") || 1),
              children: Number(getParam(params, "children") || 0),
              infants: Number(getParam(params, "infants") || 0),
              cabinClass,
            }}
          />
        </div>
      </div>
      <section className="relative z-0 min-h-screen rounded-t-[32px] bg-[#ebedf1] pt-24">
        <div className="mx-auto w-full max-w-[1200px] ">
          <FareDateSlider />
          <ShowFareResultsSection />
        </div>
      </section>
    </section>
  );
}

export default page;
