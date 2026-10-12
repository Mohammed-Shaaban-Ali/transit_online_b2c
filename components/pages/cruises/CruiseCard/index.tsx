"use client";

import Image from "next/image";
import { CalendarDays, MapPin, Ship } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { CruiseSailingOption } from "@/types/cruiseTypes";
import {
  formatCruiseDateRange,
  getCruisePackageComment,
  getCruiseRegionCode,
  isCruiseRoundTrip,
  parseCruiseDurationNights,
} from "@/utils/cruiseHelpers";
import cruisePlaceholder from "@/public/images/cruises.webp";

type Props = {
  option: CruiseSailingOption;
  onSelect?: (option: CruiseSailingOption) => void;
};

function CruiseCard({ option, onSelect }: Props) {
  const t = useTranslations("CruisePage.Card");
  const tForm = useTranslations("CruiseSearchForm");
  const locale = useLocale();

  const sailing = option.selectedSailing;
  const shipName =
    sailing?.cruiseLine?.attributesMap?.shipName || t("defaultShip");
  const start = sailing?.attributesMap?.start || "";
  const end = sailing?.attributesMap?.end || "";
  const nights = parseCruiseDurationNights(sailing?.attributesMap?.duration);
  const departurePort =
    sailing?.departurePort?.textValue ||
    sailing?.departurePort?.attributesMap?.locationCode ||
    "";
  const arrivalPort =
    sailing?.arrivalPort?.textValue ||
    sailing?.arrivalPort?.attributesMap?.locationCode ||
    "";
  const regionCode = getCruiseRegionCode(option);
  const regionLabelKey =
    regionCode === "RED"
      ? "redSea"
      : regionCode === "GULF"
        ? "arabianGulf"
        : regionCode === "MED"
          ? "mediterranean"
          : regionCode === "REPO"
            ? "worldCruises"
            : "";
  const regionLabel = regionLabelKey ? tForm(`regions.${regionLabelKey}`) : "";
  const packageComment = getCruisePackageComment(option);
  const roundTrip = isCruiseRoundTrip(option);
  const voyageId = sailing?.attributesMap?.voyageId || packageComment;

  return (
    <article
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect?.(option)}
      onKeyDown={(event) => {
        if (!onSelect) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(option);
        }
      }}
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white ${
        onSelect
          ? "cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          : ""
      }`}
    >
      <div className="relative aspect-2/1 overflow-hidden bg-gray-100">
        <Image
          src={cruisePlaceholder}
          alt={shipName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {regionLabel && (
          <span className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1 text-sm font-medium text-white">
            {regionLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <Ship className="size-4 shrink-0 text-primary" />
          <h3 className="text-base font-bold text-gray-900">{shipName}</h3>
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm font-semibold text-gray-600">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>
            {start && end ? formatCruiseDateRange(start, end, locale) : ""}
            {nights > 0 ? ` • ${t("nights", { count: nights })}` : ""}
          </p>
        </div>

        <div className="mt-2 flex items-start gap-2 text-sm font-semibold text-gray-600">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>
            {(departurePort || arrivalPort).toUpperCase()}
            {departurePort && arrivalPort && departurePort !== arrivalPort
              ? ` → ${arrivalPort.toUpperCase()}`
              : ""}
            {" • "}
            {roundTrip ? t("roundTrip") : t("oneWay")}
          </p>
        </div>
      </div>

      <div className="bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
        {packageComment || voyageId}
      </div>
    </article>
  );
}

export default CruiseCard;
