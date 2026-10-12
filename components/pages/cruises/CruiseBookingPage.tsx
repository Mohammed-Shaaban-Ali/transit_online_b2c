"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  MapPin,
  Ship,
  Users,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  CRUISE_BOOKING_FORM_DATA_KEY,
  CRUISE_BOOKING_ID_KEY,
  CRUISE_BOOKING_KEY,
  CRUISE_BOOKING_PRICE_DATA_KEY,
} from "@/constants";
import {
  useBookCruiseMutation,
  useLazyCalculateCruisePriceQuery,
} from "@/redux/features/cruises/cruisesApi";
import type { LoyaltyCalculatePriceResponse } from "@/redux/features/flights/flightsApi";
import type {
  CruiseBookResponse,
  CruiseCabinGuestSlot,
  CruiseCabinOption,
  CruiseSailingOption,
  CruiseSelectedCabinCategory,
} from "@/types/cruiseTypes";
import {
  buildCruiseBookCabinsPayload,
  getCategoryBadgeLabel,
} from "@/utils/cruiseCabinHelpers";
import {
  formatCruiseDateRange,
  getCruiseRegionCode,
  getCruiseRegionLabelKey,
  isCruiseRoundTrip,
  parseCruiseDurationNights,
} from "@/utils/cruiseHelpers";
import { toast } from "sonner";
import PriceChangeDialog from "@/components/pages/hotel/HotelBookingPage/PriceChangeDialog";
import CruiseBookingForm, {
  type CruiseBookingFormValues,
} from "./CruiseBookingForm";
import CruisePriceSidebar from "./CruisePriceSidebar";

export type CruiseBookingSessionData = {
  option: CruiseSailingOption;
  guestSlots: CruiseCabinGuestSlot[];
  cabinCount: number;
  selectedCategories: Record<number, CruiseSelectedCabinCategory>;
  selectedCabins: Record<number, CruiseCabinOption>;
  buyPrice: number;
  adults: number;
  children: number;
  infants: number;
};

type CalculatedPriceData = LoyaltyCalculatePriceResponse["data"];

type PendingPriceChange = {
  oldPrice: number;
  newPrice: number;
  currency: string;
  availableBalance: number;
  priceChanged: boolean;
  insufficientBalance: boolean;
  formData: CruiseBookingFormValues;
  bookingResponse: CruiseBookResponse;
  paymentGateway: string;
};

const BALANCE_PAYMENT_GATEWAY = "balance";
const BALANCE_RESULT_DELAY_MS = 3000;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const getPaymentGatewayOptions = (
  paymentGateways: string[] = [],
  _availableBalance = 0,
  totalPrice = 0,
) => {
  const gatewayOptions = paymentGateways.reduce<string[]>(
    (options, gateway) => {
      const value = String(gateway || "").trim();
      const alreadyExists = options.some(
        (option) => option.toLowerCase() === value.toLowerCase(),
      );
      if (
        value &&
        value.toLowerCase() !== BALANCE_PAYMENT_GATEWAY &&
        !alreadyExists
      ) {
        options.push(value);
      }
      return options;
    },
    [],
  );

  if (totalPrice > 0) {
    gatewayOptions.push(BALANCE_PAYMENT_GATEWAY);
  }

  return gatewayOptions;
};

const hasPriceChanged = (previousTotal: number, nextTotal: number) =>
  Math.round(previousTotal * 100) !== Math.round(nextTotal * 100);

const isBalancePaymentSelected = (gateway: string) =>
  gateway.toLowerCase() === BALANCE_PAYMENT_GATEWAY;

function CruiseBookingPage({
  initialData,
  onBack,
}: {
  initialData?: CruiseBookingSessionData;
  onBack?: () => void;
} = {}) {
  const t = useTranslations("CruiseBooking");
  const tCard = useTranslations("CruisePage.Card");
  const tForm = useTranslations("CruiseSearchForm");
  const tCabins = useTranslations("CruisePage.Cabins");
  const locale = useLocale();
  const router = useRouter();

  const [bookingData, setBookingData] = useState<CruiseBookingSessionData | null>(
    initialData || null,
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBalanceResultPending, setIsBalanceResultPending] = useState(false);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState("");
  const [profit, setProfit] = useState(0);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [pendingPriceChange, setPendingPriceChange] =
    useState<PendingPriceChange | null>(null);

  const [calculatePrice, calculatePriceState] =
    useLazyCalculateCruisePriceQuery();
  const [bookCruise] = useBookCruiseMutation();

  useEffect(() => {
    if (initialData) {
      setBookingData(initialData);
      setIsLoading(false);
      try {
        sessionStorage.setItem(CRUISE_BOOKING_KEY, JSON.stringify(initialData));
      } catch (error) {
        console.error("Failed to store cruise booking data", error);
      }
      return;
    }

    try {
      const stored = sessionStorage.getItem(CRUISE_BOOKING_KEY);
      if (stored) setBookingData(JSON.parse(stored));
    } catch (error) {
      console.error("Error reading cruise booking data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [initialData]);

  useEffect(() => {
    if (!bookingData) return;
    calculatePrice({
      originalPrice: Number(bookingData.buyPrice || 0),
      module: "cruises",
      points: false,
      ...(selectedPaymentGateway
        ? { paymentMethod: selectedPaymentGateway }
        : {}),
    }).catch((error) => {
      console.error("Cruise price calculation error:", error);
    });
  }, [bookingData, calculatePrice, selectedPaymentGateway]);

  const calculatedData = calculatePriceState.data?.data;
  const baseTotalPrice = Number(
    calculatedData?.total?.value || bookingData?.buyPrice || 0,
  );
  const latestTotalPrice = baseTotalPrice + profit;
  const availableBalance = Number(calculatedData?.available_balance || 0);
  const paymentGatewayOptions = useMemo(
    () =>
      getPaymentGatewayOptions(
        calculatedData?.payment_gateways,
        availableBalance,
        latestTotalPrice,
      ),
    [calculatedData?.payment_gateways, availableBalance, latestTotalPrice],
  );

  useEffect(() => {
    if (paymentGatewayOptions.length === 0) {
      setSelectedPaymentGateway("");
      return;
    }
    setSelectedPaymentGateway((current) => {
      const isBalanceInsufficient =
        current.toLowerCase() === BALANCE_PAYMENT_GATEWAY &&
        latestTotalPrice > 0 &&
        availableBalance < latestTotalPrice;

      if (
        current &&
        paymentGatewayOptions.includes(current) &&
        !isBalanceInsufficient
      ) {
        return current;
      }

      const fallback = paymentGatewayOptions.find(
        (gateway) => gateway.toLowerCase() !== BALANCE_PAYMENT_GATEWAY,
      );
      return fallback || paymentGatewayOptions[0] || "";
    });
  }, [paymentGatewayOptions, availableBalance, latestTotalPrice]);

  const sailing = bookingData?.option?.selectedSailing;
  const voyageId = sailing?.attributesMap?.voyageId || "";
  const shipName =
    sailing?.cruiseLine?.attributesMap?.shipName || tCard("defaultShip");
  const start = sailing?.attributesMap?.start || "";
  const end = sailing?.attributesMap?.end || "";
  const nights = parseCruiseDurationNights(sailing?.attributesMap?.duration);
  const departurePort =
    sailing?.departurePort?.textValue ||
    sailing?.departurePort?.attributesMap?.locationCode ||
    "";
  const roundTrip = bookingData?.option
    ? isCruiseRoundTrip(bookingData.option)
    : false;
  const regionCode = bookingData?.option
    ? getCruiseRegionCode(bookingData.option)
    : "";
  const regionLabelKey = getCruiseRegionLabelKey(regionCode);
  const regionLabel = regionLabelKey
    ? tForm(`regions.${regionLabelKey}`)
    : "";

  const guestsCount = useMemo(() => {
    if (!bookingData) return 0;
    return bookingData.adults + bookingData.children + bookingData.infants;
  }, [bookingData]);

  const buildPayload = (
    data: CruiseBookingFormValues,
    paymentGateway: string,
    redirectUrl: string,
  ) => {
    if (!bookingData) return null;

    const phoneDigits = data.phone.trim().replace(/\D/g, "");
    const countryCodeDigits = data.phoneCountryCode.replace(/\D/g, "");
    const localPhone = countryCodeDigits
      ? phoneDigits.startsWith(countryCodeDigits)
        ? phoneDigits.slice(countryCodeDigits.length)
        : phoneDigits
      : phoneDigits;

    const categoryCodesByCabin: Record<number, string> = {};
    const cabinNumbersByCabin: Record<number, string> = {};

    Object.entries(bookingData.selectedCategories).forEach(([index, category]) => {
      categoryCodesByCabin[Number(index)] = category.code;
    });
    Object.entries(bookingData.selectedCabins).forEach(([index, cabin]) => {
      cabinNumbersByCabin[Number(index)] =
        cabin.attributesMap?.cabinNumber || "";
    });

    return {
      voyageId,
      cabins: buildCruiseBookCabinsPayload({
        cabinCount: bookingData.cabinCount,
        slots: bookingData.guestSlots,
        categoryCodesByCabin,
        cabinNumbersByCabin,
      }),
      guests: data.guests.map((guest) => ({
        guestRefNumber: guest.guestRefNumber,
        gender: (guest.gender === "female" ? "Female" : "Male") as
          | "Male"
          | "Female",
        birthDate: guest.dateOfBirth,
        nationality: guest.nationality,
        givenName: guest.firstName.trim(),
        surname: guest.lastName.trim(),
      })),
      contactInfo: {
        name: data.fullName.trim(),
        email: data.email.trim(),
        phone: localPhone,
        country_calling_code: countryCodeDigits || "966",
      },
      paymentGateway,
      redirectUrl,
      profit,
    };
  };

  const completeBookingFlow = async (
    data: CruiseBookingFormValues,
    response: CruiseBookResponse,
    priceData: CalculatedPriceData,
    paymentGateway: string,
    bookedTotal: number,
  ) => {
    const resultPath = "/cruises/booking/result";
    const bookingId =
      response.bookingId ?? response.bookingReference ?? "";
    const storedPriceData: CalculatedPriceData = {
      ...priceData,
      total: {
        ...priceData.total,
        value: bookedTotal,
      },
    };

    sessionStorage.setItem(CRUISE_BOOKING_ID_KEY, String(bookingId || ""));
    sessionStorage.setItem(CRUISE_BOOKING_FORM_DATA_KEY, JSON.stringify(data));
    sessionStorage.setItem(
      CRUISE_BOOKING_PRICE_DATA_KEY,
      JSON.stringify(storedPriceData),
    );

    if (paymentGateway.toLowerCase() === BALANCE_PAYMENT_GATEWAY) {
      setIsBalanceResultPending(true);
      await wait(BALANCE_RESULT_DELAY_MS);
      router.push(`${resultPath}?success=${bookingId ? "true" : "false"}`);
      return;
    }

    if (response.redirectUrl) {
      window.location.assign(response.redirectUrl);
      return;
    }

    router.push(`${resultPath}?success=${bookingId ? "true" : "false"}`);
  };

  const submitBooking = async (data: CruiseBookingFormValues) => {
    if (!bookingData || !calculatedData) return;

    const nameParts = data.fullName.trim().split(/\s+/).filter(Boolean);
    if (nameParts.length < 2) {
      toast.error(t("errors.fullNameTwoWords"));
      return;
    }

    if (
      isBalancePaymentSelected(selectedPaymentGateway) &&
      latestTotalPrice > 0 &&
      availableBalance < latestTotalPrice
    ) {
      toast.error(t("insufficientBalance"));
      return;
    }

    const paymentGateway =
      selectedPaymentGateway &&
      paymentGatewayOptions.includes(selectedPaymentGateway)
        ? selectedPaymentGateway
        : paymentGatewayOptions[0];

    if (!paymentGateway) {
      toast.error(t("priceValidationError"));
      return;
    }

    const resultPath = "/cruises/booking/result";
    const redirectUrl = new URL(
      `/${locale}${resultPath}`,
      window.location.origin,
    ).toString();

    const payload = buildPayload(data, paymentGateway, redirectUrl);
    if (!payload) return;

    setIsSubmitting(true);
    try {
      const response = await bookCruise(payload).unwrap();
      const bookedPrice = Number(response.price ?? 0);
      const priceChanged = hasPriceChanged(latestTotalPrice, bookedPrice);
      const insufficientBalance =
        isBalancePaymentSelected(paymentGateway) &&
        bookedPrice > 0 &&
        availableBalance < bookedPrice;

      if (priceChanged || insufficientBalance) {
        setPendingPriceChange({
          oldPrice: latestTotalPrice,
          newPrice: bookedPrice,
          currency: calculatedData.currency,
          availableBalance,
          priceChanged,
          insufficientBalance,
          formData: data,
          bookingResponse: response,
          paymentGateway,
        });
        return;
      }

      await completeBookingFlow(
        data,
        response,
        calculatedData,
        paymentGateway,
        bookedPrice || latestTotalPrice,
      );
    } catch (error) {
      console.error("Cruise booking error:", error);
    } finally {
      setIsBalanceResultPending(false);
      setIsSubmitting(false);
    }
  };

  const handleContinueWithNewPrice = async () => {
    if (!pendingPriceChange || !calculatedData) return;
    const {
      formData,
      bookingResponse,
      paymentGateway,
      insufficientBalance,
      newPrice,
    } = pendingPriceChange;

    if (
      insufficientBalance &&
      isBalancePaymentSelected(selectedPaymentGateway)
    ) {
      return;
    }

    setPendingPriceChange(null);
    setIsSubmitting(true);
    try {
      await completeBookingFlow(
        formData,
        bookingResponse,
        calculatedData,
        paymentGateway,
        newPrice,
      );
    } finally {
      setIsBalanceResultPending(false);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-4 px-4 py-10">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-96 animate-pulse rounded-2xl bg-gray-200 lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-4 py-20 text-center">
        <Ship className="mb-4 size-14 text-gray-300" />
        <h2 className="mb-2 text-xl font-bold text-gray-900">{t("noData")}</h2>
        <p className="mb-6 max-w-md text-sm font-bold text-gray-500">
          {t("noDataDescription")}
        </p>
        <Button
          onClick={() => router.push("/cruises")}
          className="h-12 rounded-full px-8 font-bold"
        >
          {t("backToSearch")}
        </Button>
      </div>
    );
  }

  return (
    <section className="relative z-0 min-h-screen">
      {isBalanceResultPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-lg">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="text-sm font-bold text-gray-700">{t("submitting")}</p>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-3 sm:px-5">
        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => (onBack ? onBack() : router.push("/cruises"))}
            className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700"
            aria-label={t("back")}
          >
            <ChevronLeft className="size-5 rtl:rotate-180" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
            {t("title")}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
              <button
                type="button"
                onClick={() => setSummaryOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-3"
              >
                <h3 className="text-base font-bold text-gray-900 md:text-lg">
                  {t("summaryTitle")}
                </h3>
                <ChevronDown
                  className={`size-5 text-gray-500 transition-transform ${
                    summaryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {summaryOpen && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-base font-bold text-gray-900">
                      {shipName}
                    </h4>
                    {regionLabel && (
                      <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
                        {regionLabel}
                      </span>
                    )}
                  </div>
                  <p className="inline-flex items-center gap-2 text-sm font-bold text-gray-700">
                    <CalendarDays className="size-4 text-primary" />
                    {start && end
                      ? formatCruiseDateRange(start, end, locale)
                      : ""}
                    {nights > 0
                      ? ` • ${tCard("nights", { count: nights })}`
                      : ""}
                  </p>
                  <p className="inline-flex items-center gap-2 text-sm font-bold text-gray-700">
                    <MapPin className="size-4 text-primary" />
                    {departurePort}
                    {" • "}
                    {roundTrip ? tCard("roundTrip") : tCard("oneWay")}
                  </p>

                  <div className="space-y-2 pt-1">
                    {Array.from({ length: bookingData.cabinCount }).map(
                      (_, index) => {
                        const category = bookingData.selectedCategories[index];
                        const cabin = bookingData.selectedCabins[index];
                        const cabinNumber =
                          cabin?.attributesMap?.cabinNumber || "—";
                        const guestsInCabin = bookingData.guestSlots.filter(
                          (slot) => slot.cabinIndex === index,
                        ).length;
                        return (
                          <div
                            key={index}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 bg-slate-50 px-3 py-2.5"
                          >
                            <p className="inline-flex items-center gap-2 text-sm font-bold text-gray-800">
                              <BedDouble className="size-4 text-primary" />
                              {tCabins("cabinN", { n: index + 1 })}
                              {" • "}
                              {cabinNumber}
                            </p>
                            <p className="inline-flex items-center gap-2 text-xs font-bold text-gray-600">
                              <Users className="size-3.5 text-primary" />
                              {guestsInCabin} {t("guests")}
                              {category && (
                                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-primary">
                                  {category.badge ||
                                    getCategoryBadgeLabel(category.code)}
                                </span>
                              )}
                            </p>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
            </div>

            <CruiseBookingForm
              guestSlots={bookingData.guestSlots}
              onSubmit={submitBooking}
            />
          </div>

          <div className="lg:sticky lg:top-6 lg:col-span-1 lg:self-start">
            <CruisePriceSidebar
              calculatedData={calculatedData}
              isCalculating={calculatePriceState.isFetching}
              fallbackTotal={bookingData.buyPrice}
              paymentGateways={paymentGatewayOptions}
              selectedPaymentGateway={selectedPaymentGateway}
              onPaymentGatewayChange={setSelectedPaymentGateway}
              availableBalance={availableBalance}
              formId="cruise-booking-form"
              submitLabel={isSubmitting ? t("submitting") : t("next")}
              isSubmitting={isSubmitting}
              cabinsCount={bookingData.cabinCount}
              guestsCount={guestsCount}
              showProfitInput
              profit={profit}
              onProfitChange={setProfit}
            />
          </div>
        </div>
      </div>

      <PriceChangeDialog
        translationNamespace="CruiseBooking"
        open={Boolean(pendingPriceChange)}
        priceChanged={pendingPriceChange?.priceChanged ?? false}
        insufficientBalance={pendingPriceChange?.insufficientBalance ?? false}
        oldPrice={pendingPriceChange?.oldPrice ?? 0}
        newPrice={pendingPriceChange?.newPrice ?? 0}
        availableBalance={pendingPriceChange?.availableBalance ?? 0}
        currency={pendingPriceChange?.currency ?? ""}
        isSubmitting={isSubmitting}
        onContinue={handleContinueWithNewPrice}
        onChoosePaymentMethod={() => {
          if (!pendingPriceChange || !calculatedData) return;
          const options = getPaymentGatewayOptions(
            calculatedData.payment_gateways,
            availableBalance,
            pendingPriceChange.newPrice,
          );
          const alternative = options.find(
            (gateway) => !isBalancePaymentSelected(gateway),
          );
          if (alternative) setSelectedPaymentGateway(alternative);
          setPendingPriceChange(null);
        }}
        onBackToSearch={() => {
          setPendingPriceChange(null);
          router.push("/cruises");
        }}
      />
    </section>
  );
}

export default CruiseBookingPage;
