"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { FlightDirection } from "@/types/flightTypes";
import { FaPlane } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FLIGHT_BOOKING_KEY } from "@/constants";
import FlightItineraryRow from "@/components/pages/flights-test/showfarefirst/FlightCard/FlightItineraryRow";
import PriceDetailsCard from "./PriceDetailsCard";
import FlightBookingForm, {
  FlightBookingFormValues,
} from "./FlightBookingForm";

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
  const router = useRouter();
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

  const flights: FlightDirection[] = [
    departureFlight,
    ...(returnFlight ? [returnFlight] : []),
  ];

  return (
    <div className="mx-auto w-full max-w-[1200px]! px-2 sm:px-5 md:px-0 ">
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
          <PriceDetailsCard
            adults={flightData.adults}
            children={flightData.children}
            infants={flightData.infants}
            buyPrice={flightData.buyPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default FlightBookingPage;
