"use client";

import {
  Check,
  ChevronLeft,
  Dices,
  MoveHorizontal,
  Ship,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { CruiseCabinOption } from "@/types/cruiseTypes";
import {
  getPositionInShipLabelKey,
  getShipSideLabelKey,
  isGuaranteeCabin,
} from "@/utils/cruiseCabinHelpers";
import { cn } from "@/lib/utils";

type Props = {
  option: CruiseCabinOption;
  selected?: boolean;
  onSelect?: () => void;
  onDetails?: () => void;
};

function CruiseCabinOptionCard({
  option,
  selected,
  onSelect,
  onDetails,
}: Props) {
  const t = useTranslations("CruisePage.Cabins");
  const attrs = option.attributesMap;
  const cabinNumber = attrs?.cabinNumber || "—";
  const deckNumber = attrs?.deckNumber;
  const isGty = isGuaranteeCabin(deckNumber, cabinNumber);
  const name =
    option.content?.name || option.remark?.textValue || t("cabinFallback");
  const maxOccupancy = Number(attrs?.maxOccupancy || 0);
  const shipSideKey = getShipSideLabelKey(attrs?.shipSide);
  const positionKey = getPositionInShipLabelKey(attrs?.positionInShip);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.();
        }
      }}
      className={cn(
        "relative flex w-full cursor-pointer overflow-hidden rounded-2xl border bg-white text-start transition-all duration-200",
        selected
          ? "border-primary shadow-md ring-1 ring-primary/25"
          : "border-gray-200 hover:border-primary/30 hover:shadow-sm",
      )}
    >
      {selected && (
        <span className="absolute end-2.5 top-2.5 z-10 inline-flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-sm">
          <Check className="size-3.5" />
        </span>
      )}

      <div className="flex w-[84px] shrink-0 flex-col items-center justify-center bg-primary/10 px-2 py-5 text-center md:w-[92px]">
        {isGty ? (
          <>
            <p className="text-[11px] font-bold leading-tight text-primary">
              {t("guaranteeCabin")}
            </p>
            <Dices className="mt-2 size-7 text-primary" strokeWidth={1.75} />
          </>
        ) : (
          <>
            <p className="text-[11px] font-bold text-primary">{t("deck")}</p>
            <p className="mt-1 text-3xl font-bold leading-none text-primary">
              {deckNumber}
            </p>
          </>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3.5 md:p-4">
        <div className="min-w-0 pe-8">
          <p className="text-lg font-bold tracking-tight text-gray-900 md:text-xl">
            {cabinNumber}
          </p>
          <p className="mt-0.5 line-clamp-1 text-sm font-bold text-gray-500">
            {name}
          </p>
        </div>

        {!isGty && (shipSideKey || positionKey) && (
          <div className="flex flex-wrap gap-2">
            {shipSideKey && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                <Ship className="size-3.5" />
                {t(shipSideKey)}
              </span>
            )}
            {positionKey && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                <MoveHorizontal className="size-3.5" />
                {t(positionKey)}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          {maxOccupancy > 0 ? (
            <p className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600">
              <Users className="size-3.5 text-primary" />
              {t("upToGuests", { count: maxOccupancy })}
            </p>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDetails?.();
            }}
            className="inline-flex items-center gap-1 rounded-full border border-primary px-3.5 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            {t("details")}
            <ChevronLeft className="size-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CruiseCabinOptionCard;
