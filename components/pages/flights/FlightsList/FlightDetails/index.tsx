"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useGetFlightFareMutation } from "@/redux/features/flights/flightsApi";
import {
  FaArrowLeft,
} from "react-icons/fa";
import { useRouter } from "@/i18n/navigation";
import OfferSelection from "./OfferSelection";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import FlightCard from "../FlightCard";
import DefaultOfferDisplay from "./DefaultOfferDisplay";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { useTranslations } from "next-intl";
import ErrorSection from "./ErrorSection";
import { formatePrice } from "@/utils/formatePrice";

const FLIGHT_BOOKING_KEY = "flight-booking-data";

interface FlightDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  departureFareKey: string;
  returnFareKey?: string;
  adults: number;
  childrens: number;
  infants: number;
  cabinClass: string;
  departureFlightData?: any;
  returnFlightData?: any;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({
  isOpen,
  onClose,
  departureFareKey,
  returnFareKey,
  adults,
  childrens,
  infants,
  cabinClass,
  departureFlightData,
  returnFlightData,
}) => {
  const t = useTranslations("FlightDetails");
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [selectedOfferKey, setSelectedOfferKey] = useState<string | undefined>(
    undefined
  );
  const [selectedDepartureOffer, setSelectedDepartureOffer] = useState<
    string | null
  >(null);
  const [showReturnOffers, setShowReturnOffers] = useState(false);

  // Determine provider from flight data endpoint immediately
  const provider = useMemo((): "iati" | "sabre" => {
    const endpoint =
      departureFlightData?.endpoint || returnFlightData?.endpoint;
    if (endpoint) {
      const providerName = endpoint.toLowerCase();
      if (providerName === "sabre" || providerName === "iati") {
        return providerName as "iati" | "sabre";
      }
    }
    return "iati"; // Default to iati if endpoint not found
  }, [departureFlightData?.endpoint, returnFlightData?.endpoint]);

  const [getFlightFare, { data, isLoading: isFetching, error }] =
    useGetFlightFareMutation();

  // Ref to track the last API call parameters to prevent duplicate calls
  const lastCallParamsRef = useRef<string>("");

  // Fetch fare data when drawer opens
  useEffect(() => {
    if (isOpen && departureFareKey) {
      // Create a unique key from all parameters
      const callKey = `${departureFareKey}-${returnFareKey || ""
        }-${adults}-${childrens}-${infants}-${provider}`;

      // Only make the call if parameters have changed
      if (lastCallParamsRef.current !== callKey) {
        lastCallParamsRef.current = callKey;
        getFlightFare({
          departureFareKey,
          returnFareKey,
          adults,
          children: childrens,
          infants,
          provider,
        });
      }
    }
  }, [
    isOpen,
    departureFareKey,
    returnFareKey,
    adults,
    childrens,
    infants,
    provider,
  ]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Set default selection when offers are empty
  useEffect(() => {
    if (
      data?.data &&
      (!data.data.offers || data.data.offers.length === 0) &&
      data.data.fare_detail
    ) {
      // Auto-select default offer when no offers available
      setSelectedDepartureOffer("default");
      if (returnFareKey) {
        setSelectedOfferKey("default");
      }
    }
  }, [data?.data, returnFareKey]);

  // Reset when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDepartureOffer(null);
      setShowReturnOffers(false);
      setSelectedOfferKey(undefined);
      setSelectedOffer(null);
      // Reset the ref to allow fresh API call when drawer reopens
      lastCallParamsRef.current = "";
    }
  }, [isOpen]);

  // Get the selected offer or default price
  const getDisplayPrice = () => {
    // If default offer is selected (no offers available)
    if (
      selectedDepartureOffer === "default" &&
      (!data?.data?.offers || data?.data?.offers.length === 0) &&
      data?.data?.fare_detail
    ) {
      return {
        amount: data.data.fare_detail.price_info.total_fare || 0,
        currency: data.data.fare_detail.currency_code || "",
      };
    }

    // If return is selected, show total price
    // Must search by both departure and return to get the correct offer
    if (selectedOfferKey && selectedDepartureOffer && data?.data?.offers) {
      const selectedOffer = data.data.offers.find(
        (offer) =>
          offer.offer_details?.[0]?.name === selectedDepartureOffer &&
          offer.offer_details?.[offer.offer_details.length - 1]?.name ===
          selectedOfferKey
      );
      if (selectedOffer) {
        return {
          amount: selectedOffer.total_price,
          currency: selectedOffer.currency_code,
        };
      }
    }

    // If only departure is selected, show departure price only
    if (selectedDepartureOffer && data?.data?.offers) {
      const departureOffer = data.data.offers.find(
        (offer) => offer.offer_details?.[0]?.name === selectedDepartureOffer
      );
      if (departureOffer) {
        return {
          amount: departureOffer.minimum_offer_price,
          currency: departureOffer.currency_code,
        };
      }
    }

    // Fallback to default fare
    return {
      amount: data?.data?.fare_detail.price_info.total_fare || 0,
      currency: data?.data?.fare_detail.currency_code || "",
    };
  };

  // Handle continue to booking page
  const handleContinueToBooking = () => {
    try {
      // Determine offer key
      let offerKey = "";
      if (
        selectedDepartureOffer === "default" &&
        (!data?.data?.offers || data?.data?.offers.length === 0)
      ) {
        if (selectedOfferKey === "default" && returnFareKey) {
          offerKey = "default|default";
        } else {
          offerKey = "default";
        }
      } else if (selectedOffer && selectedOffer.offer_details) {
        const departureName =
          selectedOffer.offer_details[0]?.name || "";
        const returnName =
          selectedOffer.offer_details[
            selectedOffer.offer_details.length - 1
          ]?.name || "";
        if (returnName) {
          offerKey = `${departureName}|${returnName}`;
        } else {
          offerKey = departureName;
        }
      } else if (selectedDepartureOffer) {
        offerKey = selectedDepartureOffer;
      }

      // Determine buy price
      let buyPrice = 0;
      if (
        selectedOffer &&
        data?.data?.offers &&
        data.data.offers.length > 0
      ) {
        buyPrice = selectedOffer.total_price || 0;
      } else if (data?.data?.fare_detail) {
        buyPrice =
          data.data.fare_detail.price_info?.total_fare || 0;
      }

      // Store flight data in sessionStorage for the booking page
      const bookingData = {
        departureFareKey,
        returnFareKey: returnFareKey || undefined,
        offerKey: offerKey || undefined,
        adults,
        children: childrens,
        infants,
        cabinClass: cabinClass as "ECONOMY" | "BUSINESS",
        provider,
        departureFlightData,
        returnFlightData: returnFlightData || undefined,
        fareData: data,
        selectedOffer: selectedOffer || undefined,
        buyPrice,
        buyCurrencyId: 1,
        sellCurrencyId: 1,
      };

      sessionStorage.setItem(FLIGHT_BOOKING_KEY, JSON.stringify(bookingData));

      onClose();
      router.push("/flights/booking");
    } catch (error) {
      console.error("Error navigating to booking:", error);
    }
  };

  if (!isVisible) return null;
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="max-w-2xl w-[95vw] sm:min-w-[700px] p-0 flex flex-col overflow-y-auto h-full"
      >
        <SheetHeader className=" flex items-center justify-between px-4 py-3  flex-row text-left shrink-0">
          <SheetTitle className="text-28! font-bold  m-0">
            {t("offerSelection")}
          </SheetTitle>
        </SheetHeader>

        {/* Show departure flight card */}
        {!showReturnOffers && (
          <div className="px-4 flex flex-col gap-2">
            <h2 className="text-24 font-semibold ">
              {t("selectedDepartureFlight")}
            </h2>
            <FlightCard
              flightData={departureFlightData}
              inSheet={true}
              isSelected={false}
            />
          </div>
        )}
        {showReturnOffers && returnFareKey && (
          <div className="px-4 flex flex-col gap-2">
            {" "}
            <Button
              variant="outline-primary"
              className="rounded-md font-medium text-sm mt-4 w-fit"
              onClick={() => {
                setShowReturnOffers(false);
                setSelectedOfferKey(undefined);
                setSelectedOffer(null);
              }}
            >
              <FaArrowLeft size={11} className="rtl:rotate-180" />
              {t("backToDeparture")}
            </Button>
            <h2 className="text-24 font-semibold ">
              {t("selectedReturnFlight")}
            </h2>
            <FlightCard
              flightData={returnFlightData}
              inSheet={true}
              isSelected={false}
            />
          </div>
        )}
        {/* Content Area */}
        <div className="flex-1  ">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center p-5">
              <div className="mb-4">
                <div
                  className="animate-spin rounded-full border-4 border-gray-200 border-t-primary"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
              <h5 className="text-gray-900 mb-2">{t("loading")}</h5>
              <p className="text-gray-500 text-center mb-0">
                {t("loadingDetails")}
              </p>
            </div>
          ) : error ? (
            <ErrorSection error={error} />
          ) : (
            data?.data && (
              <div className="h-full p-2 overflow-x-hidden">
                {/* Offer Selection */}
                {data.data.offers && data.data.offers.length > 0 ? (
                  <div className="bg-white border-0 p-2  mb-3 rounded-lg">
                    <OfferSelection
                      offers={data.data.offers}
                      selectedOfferKey={selectedOfferKey}
                      selectedDepartureOffer={selectedDepartureOffer}
                      showReturnOffers={showReturnOffers}
                      showDepartureOffers={!showReturnOffers}
                      onDepartureSelect={(departureName) => {
                        setSelectedDepartureOffer(departureName);
                        setShowReturnOffers(false);
                        setSelectedOfferKey(undefined);
                        setSelectedOffer(null);
                      }}
                      onOfferSelect={(offerKey) => {
                        setSelectedOfferKey(offerKey);
                        // Must search by both departure and return to get the correct offer
                        setSelectedOffer(
                          data.data.offers.find(
                            (offer) =>
                              offer.offer_details?.[0]?.name ===
                              selectedDepartureOffer &&
                              offer.offer_details?.[
                                offer.offer_details.length - 1
                              ]?.name === offerKey
                          )
                        );
                      }}
                      onBackToDeparture={() => {
                        setShowReturnOffers(false);
                        setSelectedOfferKey(undefined);
                        setSelectedOffer(null);
                      }}
                    />
                  </div>
                ) : (
                  // Default Offer Display
                  data.data.fare_detail && (
                    <DefaultOfferDisplay
                      showReturnOffers={showReturnOffers}
                      selectedDepartureOffer={selectedDepartureOffer || ""}
                      returnFareKey={returnFareKey || ""}
                      setReturnFareKey={(returnFareKey: string) => {
                        setSelectedOfferKey(returnFareKey);
                      }}
                      departureFlightData={departureFlightData}
                      selectedOfferKey={selectedOfferKey || ""}
                      setSelectedOfferKey={setSelectedOfferKey}
                      data={data}
                      setShowReturnOffers={setShowReturnOffers}
                    />
                  )
                )}
              </div>
            )
          )}
        </div>

        {/* Continue to booking button */}
        {data?.data &&
          !isFetching &&
          (selectedDepartureOffer ||
            showReturnOffers ||
            !data.data.offers ||
            data.data.offers.length === 0) && (
            <div className="px-4 pb-6 pt-3 border-t-2 border-gray-200 w-full shrink-0">
              <div className="flex items-end justify-between gap-5">
                {/* total price */}
                <div className="">
                  <h4 className="text-24 font-medium ">
                    {t("totalPrice")}
                  </h4>
                  <div className="text-32 font-bold text-primary flex items-center gap-1 rtl:flex-row-reverse">
                    <CurrencySymbol size="lg" />
                    {formatePrice(getDisplayPrice().amount || 0)}
                  </div>
                </div>

                {/* "Continue" button - when return offers still needed */}
                {!showReturnOffers && returnFareKey && (
                  <Button
                    onClick={() => {
                      setShowReturnOffers(true);
                      setSelectedOfferKey(undefined);
                      setSelectedOffer(null);
                    }}
                    className="h-12 rounded-full px-5!"
                    disabled={isFetching}
                  >
                    {t("continue")}
                  </Button>
                )}

                {/* "Continue to Booking" button - final step */}
                {(showReturnOffers || !returnFareKey) && (
                  <Button
                    onClick={handleContinueToBooking}
                    className="h-12 rounded-full px-5!"
                    disabled={
                      isFetching ||
                      (!!returnFareKey &&
                        showReturnOffers &&
                        selectedOfferKey === undefined &&
                        !(
                          selectedDepartureOffer === "default" &&
                          (!data?.data?.offers || data?.data?.offers.length === 0)
                        ))
                    }
                  >
                    {t("continueToBooking")}
                  </Button>
                )}
              </div>
            </div>
          )}
      </SheetContent>
    </Sheet>
  );
};

export default FlightDetails;
