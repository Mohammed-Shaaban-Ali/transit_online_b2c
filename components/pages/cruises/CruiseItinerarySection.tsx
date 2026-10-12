"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Flag,
  MapPin,
  Route,
  Waves,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { CruiseSailingOption, CruiseTimelineDay } from "@/types/cruiseTypes";
import {
  formatCruiseDateRange,
  formatCruiseDayParts,
  getCruiseRegionCode,
  getCruiseRegionLabelKey,
  isCruiseRoundTrip,
  parseCruiseDurationNights,
} from "@/utils/cruiseHelpers";
import CruiseStepLayout from "./CruiseStepLayout";

type Props = {
  option: CruiseSailingOption;
  days: CruiseTimelineDay[];
  onBack: () => void;
  onNext?: () => void;
  onRetry?: () => void;
  isLoading?: boolean;
  isError?: boolean;
};

function TimelineDayCard({ day }: { day: CruiseTimelineDay }) {
  const t = useTranslations("CruisePage.Itinerary");
  const locale = useLocale();
  const parts = formatCruiseDayParts(day.date, locale);
  const weekday = day.dayOfWeek
    ? day.dayOfWeek.slice(0, 3).toUpperCase()
    : parts.weekday;

  return (
    <div className="flex items-stretch gap-3">
      <div className="flex w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-xl bg-primary/15 px-2 py-3 text-center text-primary">
        <span className="text-[11px] font-bold tracking-wide">{weekday}</span>
        <span className="mt-0.5 text-2xl font-bold leading-none text-primary">
          {parts.day}
        </span>
        <span className="mt-1 text-[11px] font-bold">{parts.month}</span>
      </div>

      <div className="flex min-h-[5.5rem] min-w-0 flex-1 flex-col justify-center rounded-xl border border-gray-200 bg-white p-3 shadow-xs">
        {day.kind === "sea" ? (
          <div className="flex items-center justify-start gap-2 text-start">
            <Waves className="size-5 shrink-0 text-primary" />
            <span className="text-base font-bold text-gray-900">
              {t("dayAtSea")}
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-bold text-gray-900">
                {day.portName}
              </h4>
              {day.portCode && (
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700">
                  {day.portCode}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {day.arrivalTime && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  <ArrowDownLeft className="size-3.5" />
                  {t("arrival")} {day.arrivalTime}
                </span>
              )}
              {day.departureTime && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  <ArrowUpRight className="size-3.5" />
                  {t("departure")} {day.departureTime}
                </span>
              )}
            </div>

            {day.hasShorex && (
              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                <Flag className="size-3.5" />
                {t("shoreExcursions")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CruiseItinerarySection({
  option,
  days,
  onBack,
  onNext,
  onRetry,
  isLoading,
  isError,
}: Props) {
  const t = useTranslations("CruisePage.Itinerary");
  const tCard = useTranslations("CruisePage.Card");
  const tForm = useTranslations("CruiseSearchForm");
  const locale = useLocale();

  const sailing = option.selectedSailing;
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

  return (
    <CruiseStepLayout
      title={t("title")}
      backLabel={t("back")}
      onBack={onBack}
      nextLabel={t("next")}
      onNext={onNext}
      nextDisabled={!onNext || isLoading || isError || days.length === 0}
      controller={
        <div className="rounded-2xl bg-primary/5 p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-gray-900">{shipName}</h3>
            {regionLabel && (
              <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
                {regionLabel}
              </span>
            )}
          </div>
          <div className="mt-3 flex items-start gap-2 text-sm font-bold text-gray-700">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>
              {start && end ? formatCruiseDateRange(start, end, locale) : ""}
              {nights > 0 ? ` • ${tCard("nights", { count: nights })}` : ""}
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
      }
    >
      <div className="flex items-center gap-2">
        <Route className="size-4 text-primary" />
        <h3 className="text-base font-bold text-gray-900">{t("title")}</h3>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-3">
              <div className="h-24 w-[4.5rem] animate-pulse rounded-xl bg-gray-100" />
              <div className="h-24 flex-1 animate-pulse rounded-xl bg-gray-100" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white px-5 py-8 text-center">
          <p className="text-sm font-bold text-gray-700">{t("loadError")}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90"
            >
              {t("retry")}
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {days.map((day) => (
            <TimelineDayCard key={day.id} day={day} />
          ))}
        </div>
      )}
    </CruiseStepLayout>
  );
}

export default CruiseItinerarySection;
