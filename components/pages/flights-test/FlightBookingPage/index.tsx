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
import BookingSteps from "./BookingSteps";
import {
  useBookFlightMutation,
  useLazyCalculateFlightPriceQuery,
} from "@/redux/features/flights/flightsApi";
import { toast } from "sonner";

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
  const tForm = useTranslations("FlightBookingForm");
  const tFormNested = useTranslations(
    "FlightBookingPageNested.flightBookingForm",
  );
  const router = useRouter();

  const [flightData, setFlightData] = useState<FlightBookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatePrice, calculatePriceState] =
    useLazyCalculateFlightPriceQuery();
  const [bookFlight] = useBookFlightMutation();

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

  useEffect(() => {
    const runPriceValidation = async () => {
      if (!flightData) return;

      const departureLeg = flightData.departureFlightData?.legs?.[0];
      const returnLeg = flightData.returnFlightData?.legs?.[0];
      const provider =
        flightData.departureFlightData?.provider_key || flightData.provider;
      const returnProvider = flightData.returnFlightData?.provider_key;

      const carrierAirlineCode =
        departureLeg?.airline_info?.carrier_code ||
        departureLeg?.airline_info?.validating_carrier_code;
      const operatorAirlineCode =
        departureLeg?.airline_info?.operator_code ||
        departureLeg?.airline_info?.operating_airline_code;

      if (!provider || !carrierAirlineCode || !operatorAirlineCode) {
        return;
      }

      try {
        await calculatePrice({
          originalPrice: Number(flightData.buyPrice || 0),
          module: "flights",
          points: false,
          provider,
          carrierAirlineCode,
          operatorAirlineCode,
          ...(returnLeg && returnProvider
            ? {
                returnProvider,
                returnCarrierAirlineCode:
                  returnLeg?.airline_info?.carrier_code ||
                  returnLeg?.airline_info?.validating_carrier_code,
                returnOperatorAirlineCode:
                  returnLeg?.airline_info?.operator_code ||
                  returnLeg?.airline_info?.operating_airline_code,
              }
            : {}),
        }).unwrap();
      } catch (error) {
        console.error("Price calculation error:", error);
      }
    };

    runPriceValidation();
  }, [flightData, calculatePrice]);

  const getOfferValueForBooking = (bookingData: FlightBookingData) => {
    if (bookingData.offerKey) return bookingData.offerKey;

    const details = bookingData.selectedOffer?.offer_details;
    if (!Array.isArray(details) || details.length === 0) return undefined;

    const firstName = details[0]?.name;
    const lastName = details[details.length - 1]?.name;
    if (!firstName) return undefined;

    if (bookingData.returnFareKey && lastName) {
      return `${firstName}|${lastName}`;
    }

    return firstName;
  };

  const handleBookingSubmit = async (data: FlightBookingFormValues) => {
    if (!flightData) return;

    const nameParts = data.fullName.trim().split(/\s+/).filter(Boolean);
    if (nameParts.length < 2) {
      toast.error("Contact name must include at least two words.");
      return;
    }

    const calculatedData = calculatePriceState.data?.data;
    const paymentGateway = calculatedData?.payment_gateways?.[0];

    if (!calculatedData || !paymentGateway) {
      toast.error("Unable to validate latest price. Please try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingPayload = {
        paymentGateway,
        ...(calculatedData.coupon_code
          ? { couponCode: calculatedData.coupon_code }
          : {}),
        departureFareKey: flightData.departureFareKey,
        ...(flightData.returnFareKey
          ? { returnFareKey: flightData.returnFareKey }
          : {}),
        ...(getOfferValueForBooking(flightData)
          ? { offer: getOfferValueForBooking(flightData) }
          : {}),
        contact_info: {
          name: data.fullName.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          country_code: "20",
        },
        paxList: data.passengers.map((passenger) => ({
          name: passenger.firstName.trim(),
          lastName: passenger.lastName.trim(),
          birthDate: passenger.dateOfBirth,
          type: passenger.type.toUpperCase(),
          gender: passenger.gender.toUpperCase(),
          identityInfo: {
            passport: {
              citizenshipCountry: passenger.nationality,
              endDate: passenger.passportExpiry,
              no: passenger.passportNumber.trim(),
            },
            notTurkishCitizen: passenger.nationality !== "TR",
            notPakistanCitizen: passenger.nationality !== "PK",
          },
        })),
      };

      const response = await bookFlight(bookingPayload).unwrap();

      sessionStorage.setItem(
        "FLIGHT_BOOKING_ID",
        String(response.bookingId || ""),
      );
      sessionStorage.setItem("FLIGHT_BOOKING_FORM_DATA", JSON.stringify(data));
      sessionStorage.setItem(
        "FLIGHT_BOOKING_PRICE_DATA",
        JSON.stringify(calculatedData),
      );

      if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
        return;
      }

      router.push("/flights/booking/success");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to complete booking. Please check data and retry.");
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
    <section
      className="relative z-0 min-h-screen 
      rounded-t-2xl md:rounded-t-[32px] bg-[#f3f3f3] py-6 md:py-12 "
    >
      <div className="mx-auto w-full max-w-[1200px]! px-3 sm:px-5 md:px-0">
        <div className="hidden md:block bg-white w-full h-[220px] md:h-[330px] rounded-t-2xl md:rounded-t-[32px] absolute top-0 left-0 z-0"></div>
        <BookingSteps />
        <h1 className="text-xl md:text-28 font-bold mb-4 md:mb-6 relative z-10">
          {t("title")}
        </h1>

        {/* ===== Form + Price Summary Grid ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
          {/* Left: Booking Form */}
          <div className="lg:col-span-2">
            {/* ===== Collapsible Flight Itinerary ===== */}
            <div className="mb-4 md:mb-6">
              <FlightItineraryRow flights={flights} />
            </div>

            <FlightBookingForm
              adults={flightData.adults}
              children={flightData.children}
              infants={flightData.infants}
              onSubmit={handleBookingSubmit}
              flights={flights}
            />
          </div>

          {/* Right: Price summary (lg: sticky) */}
          <div className="lg:col-span-1 lg:self-start lg:sticky lg:top-6 lg:z-20">
            <PriceDetailsCard
              adults={flightData.adults}
              children={flightData.children}
              infants={flightData.infants}
              buyPrice={
                calculatePriceState.data?.data?.total?.value ||
                flightData.buyPrice
              }
              currency={calculatePriceState.data?.data?.currency}
              paymentDetails={calculatePriceState.data?.data?.payments}
              paymentGateways={calculatePriceState.data?.data?.payment_gateways}
              isCalculating={calculatePriceState.isFetching}
              calculationError={
                calculatePriceState.isError
                  ? "Price check failed, default fare is shown."
                  : null
              }
              formId="flight-booking-form"
              submitLabel={
                isSubmitting ? tForm("submitting") : tFormNested("next")
              }
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlightBookingPage;
