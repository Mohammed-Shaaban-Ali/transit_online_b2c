"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
  Ship,
  Users,
  XCircle,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import {
  CRUISE_BOOKING_FORM_DATA_KEY,
  CRUISE_BOOKING_ID_KEY,
  CRUISE_BOOKING_KEY,
  CRUISE_BOOKING_OUTCOME_KEY,
  CRUISE_BOOKING_PRICE_DATA_KEY,
} from "@/constants";
import { useBookingOutcomeFromUrl } from "@/hooks/useBookingOutcomeFromUrl";
import { useLazyGetCruiseBookingQuery } from "@/redux/features/cruises/cruisesApi";
import type { LoyaltyCalculatePriceResponse } from "@/redux/features/flights/flightsApi";
import type { CruiseBookingSessionData } from "@/components/pages/cruises/CruiseBookingPage";
import type { CruiseBookingFormValues } from "@/components/pages/cruises/CruiseBookingForm";
import {
  getCategoryBadgeLabel,
} from "@/utils/cruiseCabinHelpers";
import {
  formatCruiseDateRange,
  getCruiseRegionCode,
  getCruiseRegionLabelKey,
  isCruiseRoundTrip,
  parseCruiseDurationNights,
} from "@/utils/cruiseHelpers";
import { formatePrice } from "@/utils/formatePrice";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";

type CalculatedPriceData = LoyaltyCalculatePriceResponse["data"];

export default function CruiseBookingResultPage() {
  const t = useTranslations("CruiseBooking");
  const tCard = useTranslations("CruisePage.Card");
  const tForm = useTranslations("CruiseSearchForm");
  const tCabins = useTranslations("CruisePage.Cabins");
  const locale = useLocale();
  const router = useRouter();
  const outcome = useBookingOutcomeFromUrl(CRUISE_BOOKING_OUTCOME_KEY);
  const isSuccess = outcome === "success";

  const [bookingId, setBookingId] = useState("");
  const [formData, setFormData] = useState<CruiseBookingFormValues | null>(
    null,
  );
  const [bookingData, setBookingData] =
    useState<CruiseBookingSessionData | null>(null);
  const [priceData, setPriceData] = useState<CalculatedPriceData | null>(null);
  const [verified, setVerified] = useState(false);
  const [getCruiseBooking, bookingState] = useLazyGetCruiseBookingQuery();

  useEffect(() => {
    try {
      const storedId = sessionStorage.getItem(CRUISE_BOOKING_ID_KEY) || "";
      const storedForm = sessionStorage.getItem(CRUISE_BOOKING_FORM_DATA_KEY);
      const storedBooking = sessionStorage.getItem(CRUISE_BOOKING_KEY);
      const storedPrice = sessionStorage.getItem(CRUISE_BOOKING_PRICE_DATA_KEY);

      setBookingId(storedId);
      if (storedForm) {
        setFormData(JSON.parse(storedForm) as CruiseBookingFormValues);
      }
      if (storedBooking) {
        setBookingData(JSON.parse(storedBooking) as CruiseBookingSessionData);
      }
      if (storedPrice) {
        setPriceData(JSON.parse(storedPrice) as CalculatedPriceData);
      }

      if (storedId && isSuccess) {
        getCruiseBooking(storedId)
          .unwrap()
          .then(() => setVerified(true))
          .catch(() => setVerified(false));
      }
    } catch (error) {
      console.error("Error loading cruise booking result:", error);
    }
  }, [getCruiseBooking, isSuccess]);

  const sailing = bookingData?.option?.selectedSailing;
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
    if (!bookingData) return formData?.guests.length ?? 0;
    return bookingData.adults + bookingData.children + bookingData.infants;
  }, [bookingData, formData]);

  const total =
    priceData?.total?.value ?? Number(bookingData?.buyPrice || 0);
  const payments = priceData?.payments ?? [];
  const showPriceSidebar = Boolean(priceData || bookingData);

  const guestTypeLabel = (type: CruiseBookingFormValues["guests"][number]["type"]) => {
    if (type === "child") return t("child");
    if (type === "infant") return t("infant");
    return t("adult");
  };

  return (
    <section className="relative flex min-h-screen flex-col text-sm md:bg-primary md:text-base">
      <div className="h-[108px] bg-primary md:h-[76px] md:bg-transparent">
        <NewNavbar />
      </div>

      <div className="relative z-0 flex min-h-[calc(100vh-108px)] flex-1 flex-col rounded-t-2xl bg-[#f7f7f7] py-8 md:min-h-[calc(100vh-76px)] md:rounded-t-[32px] md:py-12">
        <div className="mx-auto w-full max-w-[1100px] flex-1 px-4 sm:px-5">
          <div
            className={`grid grid-cols-1 gap-5 lg:gap-6 ${
              showPriceSidebar ? "lg:grid-cols-3" : ""
            }`}
          >
            <div
              className={`space-y-5 ${showPriceSidebar ? "lg:col-span-2" : "mx-auto w-full max-w-[720px]"}`}
            >
              <div
                className={`rounded-2xl border p-6 md:p-8 ${
                  isSuccess
                    ? "border-emerald-200 bg-emerald-50/70"
                    : "border-red-200 bg-red-50/70"
                }`}
              >
                <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-start">
                  <div
                    className={`flex size-16 shrink-0 items-center justify-center rounded-full ${
                      isSuccess ? "bg-emerald-100" : "bg-red-100"
                    }`}
                  >
                    {isSuccess ? (
                      <CheckCircle2
                        className="size-9 text-emerald-600"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    ) : (
                      <XCircle
                        className="size-9 text-red-600"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2.5">
                    <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
                      {isSuccess
                        ? t("resultSuccessTitle")
                        : t("resultFailedTitle")}
                    </h1>
                    <p className="text-sm leading-relaxed text-slate-600 md:text-[15px]">
                      {isSuccess
                        ? t("resultSuccessDescription")
                        : t("resultFailedDescription")}
                    </p>

                    {isSuccess ? (
                      <Link
                        href="/my-booking"
                        className="inline-flex text-sm font-semibold text-primary underline-offset-2 hover:underline"
                      >
                        {t("viewMyBookings")}
                      </Link>
                    ) : null}

                    {bookingId ? (
                      <p className="text-sm font-semibold text-slate-800">
                        <span className="text-slate-500">
                          {t("bookingReference")}:{" "}
                        </span>
                        <span className="text-primary">{bookingId}</span>
                      </p>
                    ) : null}

                    {isSuccess && bookingState.isFetching ? (
                      <p className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Loader2 className="size-3.5 animate-spin" />
                        {t("verifyingBooking")}
                      </p>
                    ) : null}

                    {isSuccess && verified ? (
                      <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="size-3.5" />
                        {t("bookingVerified")}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <Button
                    onClick={() => router.push("/cruises")}
                    className="h-11 rounded-full px-7 font-bold"
                  >
                    {isSuccess ? t("backToSearch") : t("tryAgain")}
                  </Button>
                  {!isSuccess ? (
                    <Button
                      variant="outline"
                      onClick={() => router.push("/cruises/booking")}
                      className="h-11 rounded-full border-slate-200 bg-white px-7 font-bold text-slate-700 hover:bg-slate-50"
                    >
                      {t("back")}
                    </Button>
                  ) : null}
                </div>
              </div>

              {formData ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
                  <h2 className="text-base font-bold text-slate-900 md:text-lg">
                    {t("contactTitle")}
                  </h2>
                  <div className="mt-4 space-y-3 rounded-xl border border-gray-100 bg-slate-50/80 p-4 text-sm">
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-x-6">
                      <span className="shrink-0 font-semibold text-slate-500">
                        {t("fullName")}
                      </span>
                      <span className="font-medium text-slate-900">
                        {formData.fullName}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-x-6">
                      <span className="shrink-0 font-semibold text-slate-500">
                        {t("email")}
                      </span>
                      <span className="font-medium text-slate-900">
                        {formData.email}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-x-6">
                      <span className="shrink-0 font-semibold text-slate-500">
                        {t("phone")}
                      </span>
                      <span className="font-medium text-slate-900 [direction:ltr]">
                        {formData.phoneCountryCode} {formData.phone}
                      </span>
                    </div>
                  </div>

                  {formData.guests.length > 0 ? (
                    <>
                      <h3 className="mt-5 text-base font-bold text-slate-900">
                        {t("guestsTitle")}
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {formData.guests.map((guest, index) => (
                          <li
                            key={`${guest.firstName}-${guest.lastName}-${index}`}
                            className="flex flex-wrap items-baseline gap-2 rounded-xl border border-gray-100 px-4 py-3 text-sm"
                          >
                            <span className="font-semibold text-slate-500">
                              {guestTypeLabel(guest.type)} {index + 1}:
                            </span>
                            <span className="font-medium text-slate-900">
                              {guest.firstName} {guest.lastName}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              ) : null}

              {bookingData ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
                  <h2 className="mb-4 text-base font-bold text-slate-900 md:text-lg">
                    {t("summaryTitle")}
                  </h2>

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Ship className="size-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {shipName}
                        </h3>
                        {regionLabel ? (
                          <span className="mt-1 inline-block rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white">
                            {regionLabel}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5 text-sm font-semibold text-slate-700">
                    {start && end ? (
                      <p className="inline-flex items-center gap-2">
                        <CalendarDays className="size-4 shrink-0 text-primary" />
                        {formatCruiseDateRange(start, end, locale)}
                        {nights > 0
                          ? ` • ${tCard("nights", { count: nights })}`
                          : ""}
                      </p>
                    ) : null}
                    {departurePort ? (
                      <p className="inline-flex items-center gap-2">
                        <MapPin className="size-4 shrink-0 text-primary" />
                        {departurePort}
                        {" • "}
                        {roundTrip ? tCard("roundTrip") : tCard("oneWay")}
                      </p>
                    ) : null}
                    <p className="inline-flex items-center gap-2">
                      <Users className="size-4 shrink-0 text-primary" />
                      {bookingData.cabinCount} {t("cabins")} • {guestsCount}{" "}
                      {t("guests")}
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
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
                            <p className="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
                              <BedDouble className="size-4 text-primary" />
                              {tCabins("cabinN", { n: index + 1 })}
                              {" • "}
                              {cabinNumber}
                            </p>
                            <p className="inline-flex items-center gap-2 text-xs font-bold text-slate-600">
                              <Users className="size-3.5 text-primary" />
                              {guestsInCabin} {t("guests")}
                              {category ? (
                                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-primary">
                                  {category.badge ||
                                    getCategoryBadgeLabel(category.code)}
                                </span>
                              ) : null}
                            </p>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {showPriceSidebar ? (
              <aside className="lg:sticky lg:top-6 lg:col-span-1 lg:self-start">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="p-5 md:p-6">
                    <h3 className="mb-4 text-base font-bold text-slate-900 md:text-lg">
                      {t("paymentSummary")}
                    </h3>

                    {(bookingData || guestsCount > 0) && (
                      <p className="mb-3 text-sm font-semibold text-slate-600">
                        {bookingData
                          ? `${bookingData.cabinCount} ${t("cabins")} • ${guestsCount} ${t("guests")}`
                          : `${guestsCount} ${t("guests")}`}
                      </p>
                    )}

                    {payments.length > 0 ? (
                      <div className="my-2 space-y-2 border-s-2 border-gray-200 ps-3 text-sm font-semibold text-slate-600">
                        {payments.map((item, idx) => {
                          const isDiscount = item.type === "COUPON";
                          return (
                            <div
                              key={`${item.label}-${idx}`}
                              className="flex items-center justify-between gap-2"
                            >
                              <span>{item.label}</span>
                              <span
                                className={`inline-flex shrink-0 items-center gap-1 ${
                                  isDiscount ? "text-teal-600" : ""
                                }`}
                                dir="ltr"
                              >
                                {isDiscount ? <span>-</span> : null}
                                <CurrencySymbol size="sm" />
                                <span>{formatePrice(item.value)}</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}

                    <div className="my-4 border-t border-dashed border-gray-300" />

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-lg font-bold text-slate-900">
                        {t("total")}
                      </span>
                      <span className="inline-flex items-center gap-1 text-lg font-bold text-primary" dir="ltr">
                        <CurrencySymbol size="md" />
                        <span>{formatePrice(total)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
