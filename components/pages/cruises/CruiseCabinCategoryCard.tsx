"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import type { CruiseCategoryOption } from "@/types/cruiseTypes";
import {
  getCategoryBadgeLabel,
  getCategoryFareAmount,
} from "@/utils/cruiseCabinHelpers";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/formatNumber";
import cruiseFallbackA from "@/public/images/cruises.webp";
import cruiseFallbackB from "@/public/images/rize.jpg";
import cruiseFallbackC from "@/public/images/gita/heroimage.png";

const FALLBACK_IMAGES: StaticImageData[] = [
  cruiseFallbackA,
  cruiseFallbackB,
  cruiseFallbackC,
];

const IMAGE_INTERVAL_MS = 5000;

type CabinImage = string | StaticImageData;

type Props = {
  option: CruiseCategoryOption;
  selected?: boolean;
  onSelect?: () => void;
};

function resolveCabinImages(urls?: string[] | null): CabinImage[] {
  const apiImages = (urls || []).filter(Boolean) as string[];
  if (apiImages.length >= 3) return apiImages;
  if (apiImages.length === 0) return FALLBACK_IMAGES;

  const padded: CabinImage[] = [...apiImages];
  for (const fallback of FALLBACK_IMAGES) {
    if (padded.length >= 3) break;
    padded.push(fallback);
  }
  return padded;
}

function CruiseCabinCategoryCard({ option, selected, onSelect }: Props) {
  const t = useTranslations("CruisePage.Cabins");
  const images = resolveCabinImages(option.content?.imageUrls);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
    if (images.length <= 1) return;

    const timer = window.setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, IMAGE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [images.length, option.attributesMap?.pricedCategoryCode]);

  const name =
    option.content?.name ||
    option.attributesMap?.pricedCategoryCode ||
    t("cabinFallback");
  const maxOccupancy = Number(option.attributesMap?.maxOccupancy || 0);
  const amount = getCategoryFareAmount(option.priceInfos);
  const badge = getCategoryBadgeLabel(
    option.attributesMap?.genericCategoryCode ||
      option.attributesMap?.pricedCategoryCode,
  );
  const currentImage = images[imageIndex];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full overflow-hidden rounded-2xl border bg-white text-start transition-shadow",
        selected
          ? "border-primary shadow-md ring-1 ring-primary/30"
          : "border-gray-200 hover:shadow-sm",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${option.attributesMap?.pricedCategoryCode}-${imageIndex}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 360px"
              unoptimized={typeof currentImage === "string"}
            />
          </motion.div>
        </AnimatePresence>

        {selected && (
          <span className="absolute end-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full bg-primary text-white">
            <Check className="size-4" />
          </span>
        )}

        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                  index === imageIndex ? "bg-white" : "bg-white/50",
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-primary">
          {badge}
        </span>
        <h4 className="mt-2 text-base font-bold text-gray-900">{name}</h4>
        {maxOccupancy > 0 && (
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600">
            <Users className="size-3.5 text-primary" />
            {t("upToGuests", { count: maxOccupancy })}
          </p>
        )}

        <div className="mt-3 flex items-center justify-end border-t border-gray-100 pt-3">
          <p className="inline-flex items-center gap-1 text-lg font-bold text-primary" dir="ltr">
            <CurrencySymbol size="md" />
            <span>{formatNumber(Math.round(amount))}</span>
          </p>
        </div>
      </div>
    </button>
  );
}

export default CruiseCabinCategoryCard;
