"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, ArrowLeftRight, ChevronLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGetFlightFareMutation } from "@/redux/features/flights/flightsApi";
import ItineraryFlightLeg from "../FlightCard/FlightLeg";
import FareSlider from "./FareSlider";
import type { FlightDirection } from "@/types/flightTypes";
import type { FlightOffer } from "@/types/fareTypes";
import {
  flightDirectionToFlightData,
  flightOfferToFareOption,
  formatLegDate,
} from "./fareDialogUtils";
import ErrorSection from "@/components/pages/flights/FlightsList/FlightDetails/ErrorSection";
import DefaultOfferDisplay from "@/components/pages/flights/FlightsList/FlightDetails/DefaultOfferDisplay";
import { useRouter } from "@/i18n/navigation";
import { FLIGHT_BOOKING_KEY } from "@/constants";
import type { FareOption } from "../data/flights";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { formatePrice } from "@/utils/formatePrice";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  onClose: () => void;
  departureFlight: FlightDirection;
  returnFlight?: FlightDirection | null;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
};

type UiStep = "departure" | "return";

export default function FareSelectionDialog({
  open,
  onClose,
  departureFlight,
  returnFlight,
  adults,
  children,
  infants,
  cabinClass,
}: Props) {
  const tDetails = useTranslations("FlightDetails");
  const t = useTranslations("ShowFarePage.FareDialog");
  const router = useRouter();
  const isRoundTrip = !!returnFlight;

  const departureFareKey = departureFlight.fares?.[0]?.fare_key ?? "";
  const returnFareKey = returnFlight?.fares?.[0]?.fare_key;

  const provider = useMemo((): "iati" | "sabre" => {
    const e = departureFlight.endpoint || returnFlight?.endpoint;
    if (e === "sabre" || e === "iati") return e;
    return "iati";
  }, [departureFlight.endpoint, returnFlight?.endpoint]);

  const [getFlightFare, { data, isLoading: isFetching, error, reset }] =
    useGetFlightFareMutation();

  const lastCallRef = useRef("");

  const [uiStep, setUiStep] = useState<UiStep>("departure");
  const [selectedDepartureFareId, setSelectedDepartureFareId] = useState("");
  const [selectedReturnFareId, setSelectedReturnFareId] = useState("");

  /** Mirrors FlightDetails default-offer flow */
  const [showReturnOffers, setShowReturnOffers] = useState(false);
  const [selectedDepartureOffer, setSelectedDepartureOffer] = useState<
    string | null
  >(null);
  const [selectedOfferKey, setSelectedOfferKey] = useState<string | undefined>(
    undefined,
  );

  const departureLeg = departureFlight.legs?.[0];
  const retFirst = returnFlight?.legs?.[0];

  const headerTitle = useMemo(() => {
    const from =
      departureLeg?.departure_info?.city_name ||
      departureLeg?.departure_info?.airport_code ||
      "";
    const to =
      departureLeg?.arrival_info?.city_name ||
      departureLeg?.arrival_info?.airport_code ||
      "";
    return { from, to };
  }, [departureLeg]);

  const departureDisplay = useMemo(
    () => flightDirectionToFlightData(departureFlight),
    [departureFlight],
  );
  const returnDisplay = useMemo(
    () => (returnFlight ? flightDirectionToFlightData(returnFlight) : null),
    [returnFlight],
  );

  const depDateLabel = formatLegDate(departureLeg?.departure_info?.date);
  const retDateLabel = retFirst
    ? formatLegDate(retFirst.departure_info?.date)
    : "";

  useEffect(() => {
    if (!open || !departureFareKey) return;
    const key = `${departureFareKey}-${returnFareKey ?? ""}-${adults}-${children}-${infants}-${provider}`;
    if (lastCallRef.current === key) return;
    lastCallRef.current = key;
    getFlightFare({
      departureFareKey,
      returnFareKey,
      adults,
      children,
      infants,
      provider,
    });
  }, [
    open,
    departureFareKey,
    returnFareKey,
    adults,
    children,
    infants,
    provider,
    getFlightFare,
  ]);

  useEffect(() => {
    if (!open) {
      lastCallRef.current = "";
      reset();
      setUiStep("departure");
      setSelectedDepartureFareId("");
      setSelectedReturnFareId("");
      setShowReturnOffers(false);
      setSelectedDepartureOffer(null);
      setSelectedOfferKey(undefined);
    }
  }, [open, reset]);

  const offers = data?.data?.offers ?? [];
  const fareDetail = data?.data?.fare_detail;
  const isDefaultFareOnly =
    !!data?.data &&
    (!data.data.offers || data.data.offers.length === 0) &&
    !!fareDetail;

  /**
   * Departure offers: unique by offer_details[0].name (same as old OfferSelection).
   * One card per departure package name.
   */
  const departureOffers = useMemo(() => {
    const seen = new Set<string>();
    return offers.filter((o: FlightOffer) => {
      const name = o.offer_details?.[0]?.name;
      if (!name || seen.has(name)) return false;
      seen.add(name);
      return true;
    });
  }, [offers]);

  /**
   * selectedDepartureFareId now stores offer_details[0].name directly
   * (same as old selectedDepartureName / selectedDepartureOffer).
   */

  /**
   * Return offers: all offers matching the selected departure package name
   * (same as old OfferSelection returnOffers filter).
   */
  const returnOffers = useMemo(() => {
    if (!selectedDepartureFareId) return [];
    return offers.filter(
      (o: FlightOffer) =>
        o.offer_details?.[0]?.name === selectedDepartureFareId,
    );
  }, [offers, selectedDepartureFareId]);

  useEffect(() => {
    if (
      data?.data &&
      (!data.data.offers || data.data.offers.length === 0) &&
      data.data.fare_detail
    ) {
      setSelectedDepartureOffer("default");
      if (returnFareKey) {
        setSelectedOfferKey("default");
      }
    }
  }, [data?.data, returnFareKey]);

  /** Drop invalid return selection when departure changes. */
  useEffect(() => {
    if (!isRoundTrip || returnOffers.length === 0) return;
    if (!selectedReturnFareId) return;
    const lastIdx = (offer: FlightOffer) =>
      offer.offer_details?.[offer.offer_details.length - 1]?.name;
    const stillValid = returnOffers.some(
      (o) => lastIdx(o) === selectedReturnFareId,
    );
    if (!stillValid) {
      setSelectedReturnFareId("");
    }
  }, [isRoundTrip, returnOffers, selectedReturnFareId]);

  useEffect(() => {
    if (open && departureFareKey) {
      setShowReturnOffers(false);
    }
  }, [open, departureFareKey, returnFareKey]);

  const fareOptionsDeparture: FareOption[] = useMemo(() => {
    if (offers.length === 0) return [];
    return departureOffers.map((o, i) =>
      flightOfferToFareOption(o, i, "departure"),
    );
  }, [offers.length, departureOffers]);

  const fareOptionsReturn: FareOption[] = useMemo(() => {
    return returnOffers.map((o, i) => flightOfferToFareOption(o, i, "return"));
  }, [returnOffers]);

  const currentFareOptions =
    isRoundTrip && uiStep === "return"
      ? fareOptionsReturn
      : fareOptionsDeparture;

  const selectedDepartureFare = useMemo(() => {
    return (
      fareOptionsDeparture.find((f) => f.id === selectedDepartureFareId) ?? null
    );
  }, [fareOptionsDeparture, selectedDepartureFareId]);

  const selectedReturnFare = useMemo(() => {
    return fareOptionsReturn.find((f) => f.id === selectedReturnFareId) ?? null;
  }, [fareOptionsReturn, selectedReturnFareId]);

  const isReturnStep = isRoundTrip && uiStep === "return" && offers.length > 0;
  const currentSelectedId = isReturnStep
    ? selectedReturnFareId
    : selectedDepartureFareId;
  const currentSelectedFare = isReturnStep
    ? selectedReturnFare
    : selectedDepartureFare;
  const currentOnSelect = isReturnStep
    ? setSelectedReturnFareId
    : setSelectedDepartureFareId;

  const footerPriceLabel = isRoundTrip
    ? isReturnStep
      ? t("footer.roundTrip")
      : t("footer.departurePackage")
    : t("footer.total");

  const tripLabelForSlider = isRoundTrip
    ? isReturnStep
      ? t("sliderTripLabel.roundTripTotal")
      : t("sliderTripLabel.departureFare")
    : t("sliderTripLabel.oneWayTotal");

  const hasPackageSelection = isReturnStep
    ? !!selectedReturnFareId
    : !!selectedDepartureFareId;

  /** Footer price: on return step show total_price of the matched return offer. */
  const footerPriceAmount = useMemo(() => {
    if (isRoundTrip && isReturnStep) {
      if (!selectedReturnFareId || returnOffers.length === 0) return 0;
      const raw = returnOffers.find(
        (o) =>
          o.offer_details?.[o.offer_details.length - 1]?.name ===
          selectedReturnFareId,
      );
      return raw?.total_price ?? 0;
    }
    if (!selectedDepartureFareId) return 0;
    return currentSelectedFare?.price ?? 0;
  }, [
    isRoundTrip,
    isReturnStep,
    returnOffers,
    selectedReturnFareId,
    selectedDepartureFareId,
    currentSelectedFare,
  ]);

  /** Same rules as FlightDetails.getDisplayPrice */
  const getDisplayPrice = useCallback(() => {
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

    if (selectedOfferKey && selectedDepartureOffer && data?.data?.offers) {
      const selected = data.data.offers.find(
        (offer) =>
          offer.offer_details?.[0]?.name === selectedDepartureOffer &&
          offer.offer_details?.[offer.offer_details.length - 1]?.name ===
            selectedOfferKey,
      );
      if (selected) {
        return {
          amount: selected.total_price,
          currency: selected.currency_code,
        };
      }
    }

    if (selectedDepartureOffer && data?.data?.offers) {
      const departureOffer = data.data.offers.find(
        (offer) => offer.offer_details?.[0]?.name === selectedDepartureOffer,
      );
      if (departureOffer) {
        return {
          amount: departureOffer.minimum_offer_price,
          currency: departureOffer.currency_code,
        };
      }
    }

    return {
      amount: data?.data?.fare_detail?.price_info?.total_fare || 0,
      currency: data?.data?.fare_detail?.currency_code || "",
    };
  }, [selectedDepartureOffer, selectedOfferKey, data]);

  const handleBack = () => {
    setUiStep("departure");
  };

  const handleContinueToBooking = useCallback(() => {
    try {
      const payload = data?.data;
      if (!payload) return;

      let offerKey = "";
      let selectedOffer: FlightOffer | undefined;
      let buyPrice = 0;

      if (
        selectedDepartureOffer === "default" &&
        (!payload.offers || payload.offers.length === 0)
      ) {
        if (selectedOfferKey === "default" && returnFareKey) {
          offerKey = "default|default";
        } else {
          offerKey = "default";
        }
      } else if (payload.offers && payload.offers.length > 0) {
        if (isRoundTrip) {
          /**
           * selectedDepartureFareId = offer_details[0].name
           * selectedReturnFareId    = offer_details[last].name
           * Find the exact offer that matches both (same as old OfferSelection).
           */
          selectedOffer = payload.offers.find(
            (o) =>
              o.offer_details?.[0]?.name === selectedDepartureFareId &&
              o.offer_details?.[o.offer_details.length - 1]?.name ===
                selectedReturnFareId,
          );
          if (selectedOffer) {
            offerKey = `${selectedDepartureFareId}|${selectedReturnFareId}`;
          }
        } else {
          /**
           * selectedDepartureFareId = offer_details[0].name
           * Find the departure offer that matches the name.
           */
          selectedOffer = payload.offers.find(
            (o) => o.offer_details?.[0]?.name === selectedDepartureFareId,
          );
          if (selectedDepartureFareId) {
            offerKey = selectedDepartureFareId;
          }
        }
      } else if (selectedDepartureOffer) {
        offerKey = selectedDepartureOffer;
      }

      if (selectedOffer && payload.offers && payload.offers.length > 0) {
        buyPrice = selectedOffer.total_price || 0;
      } else if (payload.fare_detail) {
        buyPrice = payload.fare_detail.price_info?.total_fare || 0;
      }

      const bookingData = {
        departureFareKey,
        returnFareKey: returnFareKey || undefined,
        offerKey: offerKey || undefined,
        adults,
        children,
        infants,
        cabinClass: cabinClass as "ECONOMY" | "BUSINESS",
        provider,
        departureFlightData: departureFlight,
        returnFlightData: returnFlight || undefined,
        fareData: data,
        selectedOffer: selectedOffer || undefined,
        buyPrice,
        buyCurrencyId: 1,
        sellCurrencyId: 1,
      };

      sessionStorage.setItem(FLIGHT_BOOKING_KEY, JSON.stringify(bookingData));

      onClose();
      router.push("/new/flights/showfarefirst/booking");
    } catch (e) {
      console.error(e);
    }
  }, [
    data,
    isRoundTrip,
    returnFareKey,
    selectedReturnFareId,
    selectedDepartureFareId,
    selectedDepartureOffer,
    selectedOfferKey,
    departureFareKey,
    adults,
    children,
    infants,
    cabinClass,
    provider,
    departureFlight,
    returnFlight,
    onClose,
    router,
  ]);

  const handleNextOffers = () => {
    if (!isRoundTrip || offers.length === 0) {
      handleContinueToBooking();
      return;
    }
    if (uiStep === "departure") {
      setUiStep("return");
      setSelectedReturnFareId("");
      return;
    }
    handleContinueToBooking();
  };

  const handleClose = () => {
    setUiStep("departure");
    onClose();
  };

  const stepTitle =
    offers.length === 0
      ? t("stepTitle.reviewFare")
      : isReturnStep
        ? t("stepTitle.chooseReturnPackage")
        : isRoundTrip
          ? t("stepTitle.chooseDeparturePackage")
          : t("stepTitle.chooseFare");

  const subline =
    isReturnStep && returnDisplay
      ? `${returnDisplay.airline} · ${returnDisplay.flightNumber} · ${returnDisplay.departureTime} → ${returnDisplay.arrivalTime}`
      : `${departureDisplay.airline} · ${departureDisplay.flightNumber} · ${departureDisplay.departureTime} → ${departureDisplay.arrivalTime}`;

  const canContinueOffers =
    !isFetching &&
    !!data?.data &&
    (offers.length === 0
      ? false
      : !isRoundTrip
        ? !!selectedDepartureFareId
        : uiStep === "departure"
          ? !!selectedDepartureFareId
          : !!selectedReturnFareId);

  const continueToBookingDisabledDefault =
    isFetching ||
    (!!returnFareKey &&
      showReturnOffers &&
      selectedOfferKey === undefined &&
      !(
        selectedDepartureOffer === "default" &&
        (!data?.data?.offers || data?.data?.offers.length === 0)
      ));

  if (!departureFareKey) {
    return null;
  }

  const showOfferPackages = !isFetching && !error && offers.length > 0;
  const showDefaultBlock = !isFetching && !error && isDefaultFareOnly;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-none w-[95vw] lg:w-[1024px] p-0 gap-0 overflow-y-auto overflow-x-hidden max-h-[90vh] min-w-0">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {isReturnStep && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full p-1 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
              >
                <ChevronLeft
                  size={17}
                  className="text-gray-600 sm:h-5 sm:w-5"
                />
              </button>
            )}
            <h2 className="text-[15px] sm:text-[20px] font-bold text-gray-900 truncate">
              {headerTitle.from}{" "}
              <ArrowLeftRight
                size={14}
                className="inline mx-1 shrink-0 text-gray-600 sm:h-[18px] sm:w-[18px]"
              />{" "}
              {headerTitle.to}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
          >
            <X size={18} className="text-gray-600 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Same itinerary detail as FlightCard hover (stops, layovers, segments) */}
        <div
          className={`border-b border-gray-100 bg-gray-50 px-3 py-3 sm:px-6 sm:py-4 ${
            returnFlight
              ? "grid grid-cols-1 items-start gap-3 md:grid-cols-2 md:gap-4"
              : "space-y-3 sm:space-y-4"
          }`}
        >
          <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <ItineraryFlightLeg
              legs={departureFlight.legs}
              label="Depart"
              date={depDateLabel}
            />
          </div>
          {returnFlight && (
            <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
              <ItineraryFlightLeg
                legs={returnFlight.legs}
                label="Return"
                date={retDateLabel}
              />
            </div>
          )}
        </div>

        {/* <div className="px-6 pt-5 pb-1">
          <p className="text-[14px] font-semibold text-gray-700">{stepTitle}</p>
          {!isDefaultFareOnly && (
            <p className="text-[12px] text-gray-400 mt-0.5">{subline}</p>
          )}
        </div> */}

        <div className="min-h-[200px] min-w-0 overflow-x-hidden px-3 pb-5 pt-3 sm:px-6 sm:pb-6">
          {isFetching && (
            <div className="flex flex-col items-center justify-center gap-2 py-12 sm:gap-3 sm:py-16">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent sm:h-10 sm:w-10" />
              <p className="text-[13px] text-gray-600 sm:text-sm">
                {tDetails("loading")}
              </p>
            </div>
          )}
          {!isFetching && error && <ErrorSection error={error} />}
          {showOfferPackages && currentFareOptions.length > 0 && (
            <FareSlider
              fares={currentFareOptions}
              selectedId={currentSelectedId}
              onSelect={currentOnSelect}
              tripLabel={tripLabelForSlider}
            />
          )}
          {showDefaultBlock && data && (
            <DefaultOfferDisplay
              showReturnOffers={showReturnOffers}
              selectedDepartureOffer={selectedDepartureOffer || ""}
              returnFareKey={returnFareKey || ""}
              setReturnFareKey={(v) => setSelectedOfferKey(v)}
              departureFlightData={departureFlight}
              selectedOfferKey={selectedOfferKey || ""}
              setSelectedOfferKey={setSelectedOfferKey}
              data={data}
              setShowReturnOffers={setShowReturnOffers}
            />
          )}
        </div>

        {/* Footer: FlightDetails parity — default fare uses getDisplayPrice + Continue vs Continue to booking */}
        {data?.data &&
          !isFetching &&
          (isDefaultFareOnly
            ? !!selectedDepartureOffer
            : offers.length > 0 && hasPackageSelection) && (
            <div className="sticky bottom-0 z-10 flex flex-col gap-2 border-t border-gray-100 bg-white px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
              {isDefaultFareOnly && selectedDepartureOffer ? (
                <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                  <div className="me-auto flex items-end gap-1 sm:gap-1.5">
                    <p className="mb-0.5 text-[11px] text-gray-500 sm:mb-1 sm:text-[14px]">
                      {tDetails("totalPrice")}
                    </p>
                    <div className="flex items-baseline gap-0.5 text-[18px] font-bold text-primary rtl:flex-row-reverse sm:text-[24px]">
                      <CurrencySymbol
                        size="md"
                        className="font-bold sm:text-[18px]!"
                      />
                      <span className="tabular-nums">
                        {formatePrice(getDisplayPrice().amount || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {!showReturnOffers && returnFareKey && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowReturnOffers(true);
                          setSelectedOfferKey(undefined);
                        }}
                        className="h-10 cursor-pointer rounded bg-primary px-4 text-[14px] font-semibold text-white transition-colors hover:bg-primary/90 sm:h-14 sm:px-8 sm:text-[18px]"
                      >
                        {tDetails("continue")}
                      </button>
                    )}
                    {(showReturnOffers || !returnFareKey) && (
                      <button
                        type="button"
                        onClick={handleContinueToBooking}
                        disabled={continueToBookingDisabledDefault}
                        className="h-10 cursor-pointer rounded bg-primary px-4 text-[14px] font-semibold text-white transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 sm:h-14 sm:px-8 sm:text-[18px]"
                      >
                        {tDetails("continueToBooking")}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                  <div className="me-auto flex items-end gap-1 sm:gap-1.5">
                    <p className="mb-0.5 text-[11px] text-gray-500 sm:mb-1 sm:text-[14px]">
                      {footerPriceLabel}
                    </p>
                    <div className="flex items-baseline gap-0.5 text-[18px] font-bold text-primary rtl:flex-row-reverse sm:text-[24px]">
                      <CurrencySymbol
                        size="md"
                        className="font-bold sm:text-[18px]!"
                      />
                      <span className="tabular-nums">
                        {formatePrice(footerPriceAmount)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextOffers}
                    disabled={!canContinueOffers}
                    className="h-10 rounded bg-primary px-4 text-[14px] font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer disabled:pointer-events-none disabled:opacity-50 sm:h-14 sm:px-8 sm:text-[18px]"
                  >
                    {isRoundTrip && offers.length > 0 && uiStep === "departure"
                      ? t("next")
                      : tDetails("continueToBooking")}
                  </button>
                </div>
              )}
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}
