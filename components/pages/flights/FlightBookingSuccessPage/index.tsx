"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useFlightUtils } from "@/hooks/useFlightUtils";
import { useTranslations } from "next-intl";
import { FaPlane } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FLIGHT_BOOKING_KEY } from "@/constants";
import FlightBookingConfirmation from "@/components/shared/booking/FlightBookingConfirmation";
import type { FlightBookingFormValues } from "@/components/shared/booking/FlightBookingForm";
import type { FlightBookingData } from "@/components/pages/flights/FlightBookingPage";

const BOOKING_ID_KEY = "FLIGHT_BOOKING_ID";
const FORM_DATA_KEY = "FLIGHT_BOOKING_FORM_DATA";

const FlightBookingSuccessPage = () => {
  const t = useTranslations("FlightBooking");
  const router = useRouter();
  const { formatDate } = useFlightUtils();

  const [flightData, setFlightData] = useState<FlightBookingData | null>(null);
  const [bookingId, setBookingId] = useState("");
  const [formData, setFormData] = useState<FlightBookingFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Read all data from sessionStorage on mount
  useEffect(() => {
    try {
      const storedFlight = sessionStorage.getItem(FLIGHT_BOOKING_KEY);
      const storedBookingId = sessionStorage.getItem(BOOKING_ID_KEY);
      const storedFormData = sessionStorage.getItem(FORM_DATA_KEY);

      if (storedFlight) setFlightData(JSON.parse(storedFlight));
      if (storedBookingId) setBookingId(storedBookingId);
      if (storedFormData) setFormData(JSON.parse(storedFormData));
    } catch (error) {
      console.error("Error reading booking success data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="container my-24">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // If no data found, show fallback
  if (!flightData || !formData || !bookingId) {
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

  const departureDate = departureFlight?.legs?.[0]?.departure_info?.date
    ? formatDate(departureFlight.legs[0].departure_info.date)
    : null;
  const departureFromCode =
    departureFlight?.legs?.[0]?.departure_info?.airport_code || "";
  const departureToCode =
    departureFlight?.legs?.[departureFlight.legs.length - 1]?.arrival_info
      ?.airport_code || "";
  const returnDate = returnFlight?.legs?.[returnFlight.legs.length - 1]
    ?.arrival_info?.date
    ? formatDate(
        returnFlight.legs[returnFlight.legs.length - 1].arrival_info.date
      )
    : null;

  return (
    <FlightBookingConfirmation
      bookingId={bookingId}
      departureFrom={departureFromCode}
      departureTo={departureToCode}
      departureDate={departureDate}
      returnDate={returnDate}
      cabinClass={flightData.cabinClass}
      adults={flightData.adults}
      children={flightData.children}
      infants={flightData.infants}
      buyPrice={flightData.buyPrice}
      formData={formData}
      departureFlightData={departureFlight}
      returnFlightData={returnFlight}
      flightData={flightData}
    />
  );
};

export default FlightBookingSuccessPage;
