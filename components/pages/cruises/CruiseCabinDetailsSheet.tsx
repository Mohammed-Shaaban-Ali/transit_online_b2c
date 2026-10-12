"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BedDouble,
  Check,
  ChevronLeft,
  Layers,
  MoveHorizontal,
  Ship,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { CruiseCabinOption } from "@/types/cruiseTypes";
import {
  getPositionInShipLabelKey,
  getShipSideLabelKey,
  isGuaranteeCabin,
} from "@/utils/cruiseCabinHelpers";
import cruiseFallback from "@/public/images/cruises.webp";

const IMAGE_INTERVAL_MS = 5000;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  option: CruiseCabinOption | null;
  onChoose: () => void;
};

function CruiseCabinDetailsSheet({
  open,
  onOpenChange,
  option,
  onChoose,
}: Props) {
  const t = useTranslations("CruisePage.Cabins");
  const [imageIndex, setImageIndex] = useState(0);

  const images =
    option?.content?.imageUrls?.filter(Boolean).length
      ? (option.content?.imageUrls as string[])
      : [];
  const attrs = option?.attributesMap;
  const cabinNumber = attrs?.cabinNumber || "";
  const deckNumber = attrs?.deckNumber;
  const isGty = isGuaranteeCabin(deckNumber, cabinNumber);
  const name =
    option?.content?.name ||
    option?.remark?.textValue ||
    t("cabinFallback");
  const description = option?.content?.description || "";
  const amenities = option?.content?.amenities || [];
  const maxOccupancy = Number(attrs?.maxOccupancy || 0);
  const bedType = attrs?.bedType;
  const shipSideKey = getShipSideLabelKey(attrs?.shipSide);
  const positionKey = getPositionInShipLabelKey(attrs?.positionInShip);

  useEffect(() => {
    if (!open) return;
    setImageIndex(0);
    if (images.length <= 1) return;

    const timer = window.setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, IMAGE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [open, images.length, cabinNumber]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="left-1/2 right-auto max-h-[90vh] w-full max-w-[720px] -translate-x-1/2 overflow-y-auto rounded-t-2xl px-0 pb-6 pt-4"
      >
        <SheetHeader className="mb-3 items-start px-4 text-start sm:text-start">
          <div className="flex w-full items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex size-9 items-center justify-center rounded-full border border-primary/30 text-primary"
              aria-label={t("back")}
            >
              <ChevronLeft className="size-4 rtl:rotate-180" />
            </button>
            <SheetTitle className="flex-1 text-start text-base font-bold text-gray-900">
              {t("cabinDetails")}
            </SheetTitle>
          </div>
        </SheetHeader>

        {option && (
          <div className="px-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${cabinNumber}-${imageIndex}`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[imageIndex] || cruiseFallback}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="720px"
                    unoptimized={Boolean(images[imageIndex])}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-bold text-gray-900">{name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-gray-500">
                  {option.remark?.textValue || name}
                </p>
                {cabinNumber && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
                    {cabinNumber}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <div className="flex flex-col items-center gap-1 text-center">
                <Layers className="size-4 text-primary" />
                <p className="text-[11px] font-medium text-gray-500">
                  {t("deck")}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {isGty ? "GTY" : deckNumber || "—"}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-gray-200 text-center">
                <Ship className="size-4 text-primary" />
                <p className="text-[11px] font-medium text-gray-500">
                  {shipSideKey ? t(shipSideKey) : t("starboard")}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {shipSideKey ? t(shipSideKey) : "—"}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <MoveHorizontal className="size-4 text-primary" />
                <p className="text-[11px] font-medium text-gray-500">
                  {t("location")}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {positionKey ? t(positionKey) : "—"}
                </p>
              </div>
            </div>

            {description && (
              <div className="mt-5">
                <h4 className="text-sm font-bold text-gray-900">
                  {t("description")}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {description}
                </p>
              </div>
            )}

            {(amenities.length > 0 || maxOccupancy > 0 || bedType) && (
              <div className="mt-5">
                <h4 className="text-sm font-bold text-gray-900">
                  {t("amenities")}
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white"
                    >
                      <Check className="size-3.5" />
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {maxOccupancy > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700">
                      <Users className="size-3.5 text-primary" />
                      {t("upToGuests", { count: maxOccupancy })}
                    </span>
                  )}
                  {bedType && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700">
                      <BedDouble className="size-3.5 text-primary" />
                      {t("bedType", { type: bedType })}
                    </span>
                  )}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                onChoose();
                onOpenChange(false);
              }}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-white hover:bg-primary/90"
            >
              {t("chooseThisCabin")}
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CruiseCabinDetailsSheet;
