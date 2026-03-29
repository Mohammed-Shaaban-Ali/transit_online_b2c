"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { FlightDirection } from "@/types/flightTypes";
import { FaPlane, FaUser, FaUsers } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdChildFriendly } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import PriceCell from "@/components/shared/PriceCell";
import { useFlightUtils } from "@/hooks/useFlightUtils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FLIGHT_BOOKING_KEY } from "@/constants";
import FlightItineraryRow from "@/components/pages/flights-test/showfarefirst/FlightCard/FlightItineraryRow";
import FlightBookingForm from "@/components/shared/booking/FlightBookingForm";
import type { FlightBookingFormValues } from "@/components/shared/booking/FlightBookingForm";

export interface FlightBookingData {
  departureFareKey: string;
  returnFareKey?: string;
  offerKey?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: "ECONOMY" | "BUSINESS";
  provider: string;
  departureFlightData: FlightDirection;
  returnFlightData?: FlightDirection;
  fareData?: any;
  selectedOffer?: any;
  buyPrice: number;
  buyCurrencyId: number;
  sellCurrencyId: number;
}

const FlightBookingPage = () => {
  const t = useTranslations("FlightBooking");
  const tFlightCard = useTranslations("FlightCard");
  const router = useRouter();
  const { formatDate } = useFlightUtils();
  const [flightData, setFlightData] = useState<FlightBookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(FLIGHT_BOOKING_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFlightData(parsed);
      }
    } catch (error) {
      console.error("Error reading flight booking data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBookingSubmit = async (data: FlightBookingFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const generatedId = `FLT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      sessionStorage.setItem("FLIGHT_BOOKING_ID", generatedId);
      sessionStorage.setItem("FLIGHT_BOOKING_FORM_DATA", JSON.stringify(data));
      router.push("/flights/booking/success");
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container my-24">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-64 animate-pulse" />
          <div className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!flightData) {
    return (
      <div className="container my-24">
        <div className="flex flex-col items-center justify-center text-center">
          <FaPlane className="text-gray-300 text-6xl mb-4" />
          <h2 className="text-24 font-bold mb-2">{t("noFlightData")}</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {t("noFlightDataDescription")}
          </p>
          <Button
            onClick={() => router.push("/flights")}
            className="rounded-full h-12 px-8"
          >
            {t("backToSearch")}
          </Button>
        </div>
      </div>
    );
  }

  const departureFlight = flightData.departureFlightData;
  const returnFlight = flightData.returnFlightData;

  const departureFromCode =
    departureFlight?.legs?.[0]?.departure_info?.airport_code || "";
  const departureToCode =
    departureFlight?.legs?.[departureFlight.legs.length - 1]?.arrival_info
      ?.airport_code || "";
  const returnDate = returnFlight?.legs?.[returnFlight.legs.length - 1]
    ?.arrival_info?.date
    ? formatDate(
        returnFlight.legs[returnFlight.legs.length - 1].arrival_info.date,
      )
    : null;

  const flights: FlightDirection[] = [
    departureFlight,
    ...(returnFlight ? [returnFlight] : []),
  ];

  return (
    <div className="container my-24">
      <h1 className="text-28 font-bold mb-6">{t("title")}</h1>

      {/* ===== Form + Price Summary Grid ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Booking Form */}
        <div className="lg:col-span-2">
          {/* ===== Collapsible Flight Itinerary ===== */}
          <div className="mb-6">
            <FlightItineraryRow flights={flights} />
          </div>

          <FlightBookingForm
            adults={flightData.adults}
            children={flightData.children}
            infants={flightData.infants}
            isSubmitting={isSubmitting}
            onSubmit={handleBookingSubmit}
          />
        </div>

        {/* Right: Price Summary (Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-12">
            <div className="px-4 md:px-5 py-3 bg-gray-100 border-b border-gray-200">
              <h3 className="text-16 font-bold">{t("priceSummary")}</h3>
            </div>

            <div className="p-4 flex flex-col gap-4">
              {/* Passengers */}
              <div className="flex flex-wrap gap-3">
                {[
                  {
                    icon: <FaUser size={12} className="text-gray-400" />,
                    label: `${flightData.adults} ${flightData.adults === 1 ? tFlightCard("adult") : tFlightCard("adults")}`,
                    value: flightData.adults,
                  },
                  {
                    icon: <FaUsers size={12} className="text-gray-400" />,
                    label: `${flightData.children} ${flightData.children === 1 ? tFlightCard("child") : tFlightCard("children")}`,
                    value: flightData.children,
                  },
                  {
                    icon: (
                      <MdChildFriendly size={12} className="text-gray-400" />
                    ),
                    label: `${flightData.infants} ${flightData.infants === 1 ? tFlightCard("infant") : tFlightCard("infants")}`,
                    value: flightData.infants,
                  },
                ]
                  .filter((item) => item.value > 0)
                  .map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      {item.icon}
                      <span className="text-13 text-gray-600">
                        {item.label}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Route */}
              <div className="flex items-center justify-between text-14 font-medium text-gray-500">
                <span>{t("route")}</span>
                <div className="flex items-center gap-1.5 font-bold text-gray-700">
                  <span>{departureFromCode}</span>
                  {returnDate ? (
                    <FaExchangeAlt size={11} className="text-gray-400" />
                  ) : (
                    <FaArrowRightLong
                      size={11}
                      className="text-gray-400 rtl:rotate-180"
                    />
                  )}
                  <span>{departureToCode}</span>
                </div>
              </div>

              {/* Cabin */}
              <div className="flex items-center justify-between text-14 font-medium text-gray-500">
                <span>{tFlightCard("cabin")}</span>
                <span>
                  {flightData.cabinClass === "BUSINESS"
                    ? tFlightCard("business")
                    : tFlightCard("economy")}
                </span>
              </div>

              <div className="border-t border-dashed border-gray-300" />

              {/* Total Price */}
              <div className="flex items-center justify-between">
                <span className="text-16 font-bold">{t("totalPrice")}</span>
                <PriceCell price={flightData.buyPrice} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBookingPage;
