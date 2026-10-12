"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CRUISE_BOOKING_KEY } from "@/constants";
import { useGetCruiseCategoriesMultipleMutation } from "@/redux/features/cruises/cruisesApi";
import type {
  CruiseCabinCategoriesResult,
  CruiseCabinGuestSlot,
  CruiseCategoryOption,
  CruiseSailingOption,
  CruiseSearchFormState,
  CruiseSelectedCabinCategory,
} from "@/types/cruiseTypes";
import {
  buildCruiseCategoriesRequest,
  createCruiseGuestSlots,
  getCategoryBadgeLabel,
  getCategoryFareAmount,
  getMaxCruiseCabinCount,
  getSearchGuestTotals,
  redistributeCruiseGuestSlots,
  summarizeCabinGuests,
} from "@/utils/cruiseCabinHelpers";
import {
  formatCruiseDateRange,
  getCruiseRegionCode,
  getCruiseRegionLabelKey,
  isCruiseRoundTrip,
  parseCruiseDurationNights,
} from "@/utils/cruiseHelpers";
import { cn } from "@/lib/utils";
import CruiseCabinCategoryCard from "./CruiseCabinCategoryCard";
import CruiseCabinNumberSelectionSection from "./CruiseCabinNumberSelectionSection";
import CruiseBookingPage, {
  type CruiseBookingSessionData,
} from "./CruiseBookingPage";
import CruiseGuestDistributionSheet from "./CruiseGuestDistributionSheet";
import CruiseStepLayout from "./CruiseStepLayout";

type Props = {
  option: CruiseSailingOption;
  searchForm: CruiseSearchFormState;
  onBack: () => void;
};

function formatGuestSummary(
  summary: { adults: number; children: number; infants: number },
  t: ReturnType<typeof useTranslations>,
) {
  const parts: string[] = [];
  if (summary.adults > 0) {
    parts.push(
      `${summary.adults} ${summary.adults === 1 ? t("adult") : t("adults")}`,
    );
  }
  if (summary.children > 0) {
    parts.push(
      `${summary.children} ${
        summary.children === 1 ? t("child") : t("children")
      }`,
    );
  }
  if (summary.infants > 0) {
    parts.push(
      `${summary.infants} ${
        summary.infants === 1 ? t("infant") : t("infants")
      }`,
    );
  }
  return parts.join("، ");
}

function CruiseCabinSelectionSection({ option, searchForm, onBack }: Props) {
  const t = useTranslations("CruisePage.Cabins");
  const tCard = useTranslations("CruisePage.Card");
  const tForm = useTranslations("CruiseSearchForm");
  const locale = useLocale();

  const guestTotals = getSearchGuestTotals(searchForm);
  const maxCabins = getMaxCruiseCabinCount(guestTotals.adults);

  const [cabinCount, setCabinCount] = useState(1);
  const [guestSlots, setGuestSlots] = useState<CruiseCabinGuestSlot[]>(() =>
    createCruiseGuestSlots(
      guestTotals.adults,
      guestTotals.children,
      guestTotals.infants,
    ),
  );
  const [activeCabinIndex, setActiveCabinIndex] = useState(0);
  const [selectedByCabin, setSelectedByCabin] = useState<
    Record<number, CruiseSelectedCabinCategory>
  >({});
  const [step, setStep] = useState<"categories" | "numbers" | "booking">(
    "categories",
  );
  const [bookingPayload, setBookingPayload] =
    useState<CruiseBookingSessionData | null>(null);
  const [distributeOpen, setDistributeOpen] = useState(false);
  const [cabinResults, setCabinResults] = useState<
    CruiseCabinCategoriesResult[]
  >([]);

  const [fetchCategories, { isLoading, isError }] =
    useGetCruiseCategoriesMultipleMutation();

  const sailing = option.selectedSailing;
  const voyageId = sailing?.attributesMap?.voyageId || "";
  const shipCode =
    sailing?.cruiseLine?.attributesMap?.shipCode ||
    sailing?.attributesMap?.shipCode ||
    "";
  const shipName =
    sailing?.cruiseLine?.attributesMap?.shipName || tCard("defaultShip");
  const start = sailing?.attributesMap?.start || "";
  const end = sailing?.attributesMap?.end || "";
  const nights = parseCruiseDurationNights(sailing?.attributesMap?.duration);
  const departurePort =
    sailing?.departurePort?.textValue ||
    sailing?.departurePort?.attributesMap?.locationCode ||
    "";
  const roundTrip = isCruiseRoundTrip(option);
  const regionCode = getCruiseRegionCode(option);
  const regionLabelKey = getCruiseRegionLabelKey(regionCode);
  const regionLabel = regionLabelKey
    ? tForm(`regions.${regionLabelKey}`)
    : "";

  const requestKey = useMemo(
    () =>
      JSON.stringify({
        voyageId,
        shipCode,
        cabinCount,
        slots: guestSlots.map((slot) => ({
          id: slot.id,
          type: slot.type,
          cabinIndex: slot.cabinIndex,
        })),
      }),
    [voyageId, shipCode, cabinCount, guestSlots],
  );

  useEffect(() => {
    if (!voyageId || !shipCode) return;

    let cancelled = false;

    const run = async () => {
      try {
        const body = buildCruiseCategoriesRequest({
          voyageId,
          shipCode,
          slots: guestSlots,
          cabinCount,
        });
        const response = await fetchCategories(body).unwrap();
        if (cancelled) return;
        setCabinResults(response?.data || []);
      } catch {
        if (!cancelled) setCabinResults([]);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [requestKey, voyageId, shipCode, guestSlots, cabinCount, fetchCategories]);

  useEffect(() => {
    setActiveCabinIndex((prev) => Math.min(prev, Math.max(0, cabinCount - 1)));
  }, [cabinCount]);

  const handleCabinCountChange = (nextCount: number) => {
    const safeCount = Math.min(Math.max(1, nextCount), maxCabins);
    setCabinCount(safeCount);
    setGuestSlots((prev) => redistributeCruiseGuestSlots(prev, safeCount));
    setSelectedByCabin({});
    setActiveCabinIndex(0);
    setStep("categories");
  };

  const activeCategories: CruiseCategoryOption[] =
    cabinResults[activeCabinIndex]?.fareOption?.categoryOptions || [];

  const canContinue = Array.from({ length: cabinCount }).every((_, index) =>
    Boolean(selectedByCabin[index]?.code),
  );

  const handleSelectCategory = (category: CruiseCategoryOption) => {
    const code = category.attributesMap?.pricedCategoryCode || "";
    if (!code) return;
    setSelectedByCabin((prev) => ({
      ...prev,
      [activeCabinIndex]: {
        code,
        name:
          category.content?.name ||
          category.attributesMap?.pricedCategoryCode ||
          t("cabinFallback"),
        badge: getCategoryBadgeLabel(
          category.attributesMap?.genericCategoryCode ||
            category.attributesMap?.pricedCategoryCode,
        ),
        maxOccupancy: Number(category.attributesMap?.maxOccupancy || 0) || undefined,
        amount: getCategoryFareAmount(category.priceInfos),
      },
    }));
  };

  if (step === "booking" && bookingPayload) {
    return (
      <CruiseBookingPage
        initialData={bookingPayload}
        onBack={() => setStep("numbers")}
      />
    );
  }

  if (step === "numbers") {
    return (
      <CruiseCabinNumberSelectionSection
        option={option}
        guestSlots={guestSlots}
        cabinCount={cabinCount}
        selectedCategories={selectedByCabin}
        onBack={() => setStep("categories")}
        onNext={({ selectedCabins }) => {
          const buyPrice = Array.from({ length: cabinCount }).reduce(
            (sum: number, _, index) =>
              sum + Number(selectedByCabin[index]?.amount || 0),
            0,
          );

          const payload: CruiseBookingSessionData = {
            option,
            guestSlots,
            cabinCount,
            selectedCategories: selectedByCabin,
            selectedCabins,
            buyPrice,
            adults: guestTotals.adults,
            children: guestTotals.children,
            infants: guestTotals.infants,
          };

          try {
            sessionStorage.setItem(CRUISE_BOOKING_KEY, JSON.stringify(payload));
          } catch (error) {
            console.error("Failed to store cruise booking data", error);
          }

          setBookingPayload(payload);
          setStep("booking");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  return (
    <>
      <CruiseStepLayout
        title={t("title")}
        backLabel={t("back")}
        onBack={onBack}
        nextLabel={t("next")}
        onNext={() => setStep("numbers")}
        nextDisabled={!canContinue}
        controller={
          <div className="space-y-4">
            <div className="rounded-2xl bg-primary/5 p-4 md:p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-gray-900 md:text-lg">
                  {shipName}
                </h3>
                {regionLabel && (
                  <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
                    {regionLabel}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-start gap-2 text-sm font-bold text-gray-700">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                <p>
                  {start && end
                    ? formatCruiseDateRange(start, end, locale)
                    : ""}
                  {nights > 0
                    ? ` • ${tCard("nights", { count: nights })}`
                    : ""}
                </p>
              </div>
              <div className="mt-2 flex items-start gap-2 text-sm font-bold text-gray-700">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <p>
                  {departurePort}
                  {" • "}
                  {roundTrip ? tCard("roundTrip") : tCard("oneWay")}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="mb-3 text-sm font-bold text-gray-800">
                {t("cabinCount")}
              </p>
              <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label={t("cabinCount")}
              >
                {Array.from({ length: maxCabins }, (_, index) => {
                  const value = index + 1;
                  const selected = cabinCount === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => handleCabinCountChange(value)}
                      className={cn(
                        "inline-flex min-w-11 items-center justify-center rounded-xl px-3.5 py-2 text-sm font-bold transition-colors",
                        selected
                          ? "bg-primary text-white"
                          : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            {cabinCount > 1 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <button
                  type="button"
                  onClick={() => setDistributeOpen(true)}
                  className="mb-3 text-sm font-bold text-primary"
                >
                  {t("distributeGuests")}
                </button>
                <div className="space-y-2">
                  {Array.from({ length: cabinCount }, (_, index) => {
                    const summary = summarizeCabinGuests(guestSlots, index);
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setDistributeOpen(true)}
                        className="flex w-full items-center gap-3 rounded-xl bg-primary/10 px-3 py-3 text-start"
                      >
                        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-900">
                            {t("cabinN", { n: index + 1 })}
                          </p>
                          <p className="mt-0.5 text-xs font-bold text-gray-600">
                            {formatGuestSummary(summary, t)}
                          </p>
                        </div>
                        <ChevronRight className="size-4 shrink-0 text-gray-400 rtl:rotate-180" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {cabinCount > 1 && (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: cabinCount }, (_, index) => {
                  const selected = activeCabinIndex === index;
                  const hasChoice = Boolean(selectedByCabin[index]?.code);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveCabinIndex(index)}
                      className={cn(
                        "inline-flex min-w-28 items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors",
                        selected
                          ? "bg-primary text-white"
                          : hasChoice
                            ? "border border-primary/40 bg-primary/5 text-gray-800"
                            : "border border-gray-300 bg-white text-gray-800",
                      )}
                    >
                      {hasChoice && (
                        <Check
                          className={cn(
                            "size-4 shrink-0",
                            selected ? "text-white" : "text-primary",
                          )}
                        />
                      )}
                      {t("cabinN", { n: index + 1 })}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        }
      >
        <h3 className="text-base font-bold text-gray-900 md:text-lg">
          {t("chooseCabin")}
        </h3>

        {isLoading ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <div className="aspect-16/10 animate-pulse bg-gray-100" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-20 animate-pulse rounded-full bg-gray-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white px-4 py-8 text-center">
            <p className="text-sm font-bold text-gray-700">{t("loadError")}</p>
          </div>
        ) : activeCategories.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white px-4 py-8 text-center">
            <p className="text-sm font-bold text-gray-700">{t("empty")}</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {activeCategories.map((category) => {
              const code = category.attributesMap?.pricedCategoryCode || "";
              return (
                <CruiseCabinCategoryCard
                  key={`${activeCabinIndex}-${code}`}
                  option={category}
                  selected={selectedByCabin[activeCabinIndex]?.code === code}
                  onSelect={() => handleSelectCategory(category)}
                />
              );
            })}
          </div>
        )}
      </CruiseStepLayout>

      <CruiseGuestDistributionSheet
        open={distributeOpen}
        onOpenChange={setDistributeOpen}
        slots={guestSlots}
        cabinCount={cabinCount}
        onApply={(nextSlots) => {
          setGuestSlots(nextSlots);
          setSelectedByCabin({});
          setStep("categories");
        }}
      />
    </>
  );
}

export default CruiseCabinSelectionSection;
