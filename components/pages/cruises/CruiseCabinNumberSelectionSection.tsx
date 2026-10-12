"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  Check,
  MapPin,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useGetCruiseCabinsMultipleMutation } from "@/redux/features/cruises/cruisesApi";
import type {
  CruiseCabinGuestSlot,
  CruiseCabinOption,
  CruiseCabinsMultipleResult,
  CruiseSailingOption,
  CruiseSelectedCabinCategory,
} from "@/types/cruiseTypes";
import {
  buildCruiseCabinsMultipleRequest,
  getUniqueDeckNumbers,
} from "@/utils/cruiseCabinHelpers";
import {
  formatCruiseDateRange,
  getCruiseRegionCode,
  getCruiseRegionLabelKey,
  isCruiseRoundTrip,
  parseCruiseDurationNights,
} from "@/utils/cruiseHelpers";
import { cn } from "@/lib/utils";
import CruiseCabinDetailsSheet from "./CruiseCabinDetailsSheet";
import CruiseCabinOptionCard from "./CruiseCabinOptionCard";
import CruiseStepLayout from "./CruiseStepLayout";

type Props = {
  option: CruiseSailingOption;
  guestSlots: CruiseCabinGuestSlot[];
  cabinCount: number;
  selectedCategories: Record<number, CruiseSelectedCabinCategory>;
  onBack: () => void;
  onNext?: (payload: {
    selectedCabins: Record<number, CruiseCabinOption>;
  }) => void;
};

function CruiseCabinNumberSelectionSection({
  option,
  guestSlots,
  cabinCount,
  selectedCategories,
  onBack,
  onNext,
}: Props) {
  const t = useTranslations("CruisePage.Cabins");
  const tCard = useTranslations("CruisePage.Card");
  const tForm = useTranslations("CruiseSearchForm");
  const locale = useLocale();

  const [activeCabinIndex, setActiveCabinIndex] = useState(0);
  const [deckFilter, setDeckFilter] = useState<string>("all");
  const [cabinResults, setCabinResults] = useState<CruiseCabinsMultipleResult[]>(
    [],
  );
  const [selectedCabinByIndex, setSelectedCabinByIndex] = useState<
    Record<number, CruiseCabinOption>
  >({});
  const [detailsOption, setDetailsOption] = useState<CruiseCabinOption | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [fetchCabins, { isLoading, isError }] =
    useGetCruiseCabinsMultipleMutation();

  const sailing = option.selectedSailing;
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
  const roundTrip = isCruiseRoundTrip(option);
  const regionCode = getCruiseRegionCode(option);
  const regionLabelKey = getCruiseRegionLabelKey(regionCode);
  const regionLabel = regionLabelKey
    ? tForm(`regions.${regionLabelKey}`)
    : "";

  const categoryCodesByCabin = useMemo(() => {
    const map: Record<number, string> = {};
    Object.entries(selectedCategories).forEach(([index, category]) => {
      map[Number(index)] = category.code;
    });
    return map;
  }, [selectedCategories]);

  const requestKey = useMemo(
    () =>
      JSON.stringify({
        voyageId,
        categoryCodesByCabin,
        slots: guestSlots.map((slot) => ({
          id: slot.id,
          type: slot.type,
          cabinIndex: slot.cabinIndex,
        })),
        cabinCount,
      }),
    [voyageId, categoryCodesByCabin, guestSlots, cabinCount],
  );

  useEffect(() => {
    if (!voyageId) return;

    let cancelled = false;

    const run = async () => {
      try {
        const body = buildCruiseCabinsMultipleRequest({
          voyageId,
          slots: guestSlots,
          cabinCount,
          categoryCodesByCabin,
        });
        const response = await fetchCabins(body).unwrap();
        if (cancelled) return;
        setCabinResults(response?.data || []);
        setDeckFilter("all");
        setSelectedCabinByIndex({});
        setActiveCabinIndex(0);
      } catch {
        if (!cancelled) setCabinResults([]);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    requestKey,
    voyageId,
    guestSlots,
    cabinCount,
    categoryCodesByCabin,
    fetchCabins,
  ]);

  useEffect(() => {
    setActiveCabinIndex((prev) => Math.min(prev, Math.max(0, cabinCount - 1)));
  }, [cabinCount]);

  useEffect(() => {
    setDeckFilter("all");
  }, [activeCabinIndex]);

  const activeCategory = selectedCategories[activeCabinIndex];
  const activeCabinOptions =
    cabinResults[activeCabinIndex]?.cabinOptions || [];
  const deckNumbers = getUniqueDeckNumbers(activeCabinOptions);
  const filteredCabins =
    deckFilter === "all"
      ? activeCabinOptions
      : activeCabinOptions.filter(
          (cabin) => String(cabin.attributesMap?.deckNumber) === deckFilter,
        );

  const canContinue = Array.from({ length: cabinCount }).every((_, index) =>
    Boolean(selectedCabinByIndex[index]),
  );

  const selectCabin = (cabin: CruiseCabinOption) => {
    setSelectedCabinByIndex((prev) => ({
      ...prev,
      [activeCabinIndex]: cabin,
    }));
  };

  return (
    <>
      <CruiseStepLayout
        title={t("pickCabinNumber")}
        backLabel={t("back")}
        onBack={onBack}
        nextLabel={t("next")}
        onNext={() => onNext?.({ selectedCabins: selectedCabinByIndex })}
        nextDisabled={!canContinue || !onNext}
        controller={
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-primary/10 bg-linear-to-br from-primary/[0.07] to-slate-50 p-4 md:p-5">
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
              <div className="mt-3 space-y-2 text-sm font-bold text-gray-700">
                <p className="inline-flex items-start gap-2">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    {start && end
                      ? formatCruiseDateRange(start, end, locale)
                      : ""}
                    {nights > 0
                      ? ` • ${tCard("nights", { count: nights })}`
                      : ""}
                  </span>
                </p>
                <p className="inline-flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    {departurePort}
                    {" • "}
                    {roundTrip ? tCard("roundTrip") : tCard("oneWay")}
                  </span>
                </p>
              </div>

              {activeCategory && (
                <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-3 py-2.5">
                  <BedDouble className="size-4 shrink-0 text-primary" />
                  <p className="truncate text-sm font-bold text-gray-800">
                    <span className="text-primary">{activeCategory.badge}</span>
                    {" • "}
                    {activeCategory.name}
                  </p>
                </div>
              )}
            </div>

            {cabinCount > 1 && (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: cabinCount }, (_, index) => {
                  const selected = activeCabinIndex === index;
                  const hasChoice = Boolean(selectedCabinByIndex[index]);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveCabinIndex(index)}
                      className={cn(
                        "inline-flex min-w-28 items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors",
                        selected
                          ? "bg-primary text-white shadow-sm"
                          : hasChoice
                            ? "border border-primary/40 bg-primary/5 text-gray-800"
                            : "border border-gray-200 bg-white text-gray-800 hover:border-primary/30",
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

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="mb-2.5 text-sm font-bold text-gray-800">{t("deck")}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDeckFilter("all")}
                  className={cn(
                    "inline-flex min-w-11 items-center justify-center rounded-xl px-3.5 py-2 text-sm font-bold transition-colors",
                    deckFilter === "all"
                      ? "bg-primary text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-700 hover:border-primary/30",
                  )}
                >
                  {t("deckAll")}
                </button>
                {deckNumbers.map((deck) => (
                  <button
                    key={deck}
                    type="button"
                    onClick={() => setDeckFilter(deck)}
                    className={cn(
                      "inline-flex min-w-11 items-center justify-center rounded-xl px-3.5 py-2 text-sm font-bold transition-colors",
                      deckFilter === deck
                        ? "bg-primary text-white shadow-sm"
                        : "border border-gray-200 bg-white text-gray-700 hover:border-primary/30",
                    )}
                  >
                    {deck}
                  </button>
                ))}
              </div>
            </div>
          </div>
        }
      >
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-8 text-center">
            <p className="text-sm font-bold text-gray-700">
              {t("cabinsLoadError")}
            </p>
          </div>
        ) : filteredCabins.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-8 text-center">
            <p className="text-sm font-bold text-gray-700">{t("cabinsEmpty")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredCabins.map((cabin) => {
              const cabinNumber = cabin.attributesMap?.cabinNumber || "";
              const selectedNumber =
                selectedCabinByIndex[activeCabinIndex]?.attributesMap
                  ?.cabinNumber;
              return (
                <CruiseCabinOptionCard
                  key={`${activeCabinIndex}-${cabinNumber}-${cabin.attributesMap?.deckNumber}`}
                  option={cabin}
                  selected={selectedNumber === cabinNumber}
                  onSelect={() => selectCabin(cabin)}
                  onDetails={() => {
                    setDetailsOption(cabin);
                    setDetailsOpen(true);
                  }}
                />
              );
            })}
          </div>
        )}
      </CruiseStepLayout>

      <CruiseCabinDetailsSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        option={detailsOption}
        onChoose={() => {
          if (detailsOption) selectCabin(detailsOption);
        }}
      />
    </>
  );
}

export default CruiseCabinNumberSelectionSection;
