"use client";

import Image from "next/image";
import { MapPin, Heart, Star, Bed, User, Baby } from "lucide-react";
import { hotelSeachTypes } from "@/types/hotels";
import { convertPrice } from "@/config/currency";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localStorageHotelKey } from "@/constants";

type Props = {
  hotel: hotelSeachTypes;
  uuid: string;
  nights?: number;
  /** Number of rooms from search (URL/API). */
  rooms?: number;
  adults?: number;
  children?: number;
};

/** Booking-style yellow stars (compact, beside title) */
function StarRating({
  rating,
  compact,
}: {
  rating: number;
  compact?: boolean;
}) {
  const stars = Math.min(Math.max(Math.round(rating), 0), 5);
  const size = compact ? "h-3 w-3" : "h-[14px] w-[14px]";
  return (
    <div className="flex items-center gap-px shrink-0" aria-hidden>
      {Array.from({ length: stars }).map((_, i) => (
        <Star
          key={i}
          className={`${size} fill-[#febb02] text-[#febb02]`}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

function ratingLabelKey(score: number) {
  if (score >= 9) return "ratingOutstanding" as const;
  if (score >= 8) return "ratingExcellent" as const;
  if (score >= 7) return "ratingVeryGood" as const;
  return "ratingGood" as const;
}

type OccupancyRowKey = "rooms" | "adults" | "children";

const OCCUPANCY_ICONS: Record<
  OccupancyRowKey,
  typeof Bed | typeof User | typeof Baby
> = {
  rooms: Bed,
  adults: User,
  children: Baby,
};

export default function HotelsTestHotelCard({
  hotel,
  uuid,
  nights = 1,
  rooms,
  adults,
  children,
}: Props) {
  const locale = useLocale();
  const t = useTranslations("HotelsTestPage.HotelCard");
  const [wishlisted, setWishlisted] = useState(false);

  const occupancyLines = useMemo(() => {
    const lines: { key: OccupancyRowKey; text: string }[] = [];
    if (rooms != null && rooms > 0) {
      lines.push({
        key: "rooms",
        text: t("occupancyRooms", { count: rooms }),
      });
    }
    if (adults != null && adults >= 0) {
      lines.push({
        key: "adults",
        text: t("occupancyAdults", { count: adults }),
      });
    }
    if (children != null && children >= 0) {
      lines.push({
        key: "children",
        text: t("occupancyChildren", { count: children }),
      });
    }
    return lines;
  }, [rooms, adults, children, t]);

  const rawPrice = parseFloat(
    hotel.price?.toString().replace(/[^\d.]/g, "") || "0",
  );
  const perNightPrice = convertPrice(rawPrice);
  const totalPrice = perNightPrice * nights;
  /** Rough total incl. fees for subline (API does not split taxes on card). */
  const totalInclFeesEstimate = Math.round(totalPrice * 1.08);

  const starRating = hotel.starRating ? Number(hotel.starRating) : 0;
  const reviewScore = starRating > 0 ? Math.min(10, starRating * 2) : 8.5;

  const hasFreeCancellation =
    hotel.facilities?.some((f: { name?: string }) =>
      f?.name?.toLowerCase().includes("free cancellation"),
    ) || false;

  const hasBreakfast =
    hotel.facilities?.some((f: { name?: string }) =>
      f?.name?.toLowerCase().includes("breakfast"),
    ) || false;

  const roomTypeLabel = hotel.facilities?.find((f: { name?: string }) =>
    f?.name?.toLowerCase().includes("room"),
  )?.name;

  const locationText = hotel.locationDetails || hotel.address;

  const persistHotelAndNavigate = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(localStorageHotelKey, JSON.stringify(hotel));
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((p) => !p);
  };

  const hotelName = locale === "ar" ? hotel.displayNameAr : hotel.displayName;
  return (
    <Link
      href={`/hotels/${hotel.id}/${uuid}`}
      onClick={persistHotelAndNavigate}
      className="group flex flex-row items-stretch overflow-hidden rounded-lg border
        border-gray-200 bg-white font-sans transition-shadow duration-200
          hover:border-gray-300  max-sm:min-h-[168px]"
    >
      {/* Image — ~35% on phone, ~30% on sm+ */}
      <div
        className="relative w-[35%] min-w-[112px] max-w-[42%] shrink-0 overflow-hidden
          max-sm:max-w-none max-sm:rounded-s-xl sm:w-[30%] sm:min-w-[200px] sm:max-w-[220px]
          max-sm:h-auto max-sm:min-h-[168px] sm:h-[240px] sm:max-h-none sm:rounded-none"
      >
        {hotel.defaultImage?.FullSize ? (
          <Image
            src={hotel.defaultImage.FullSize}
            alt={hotelName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02] "
            sizes="(max-width: 639px) 40vw, 320px"
          />
        ) : (
          <div className="flex h-full min-h-[168px] w-full items-center justify-center bg-gray-200 sm:min-h-[240px]">
            <span className="text-sm text-gray-400">{t("noImage")}</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-2 end-2 z-10 flex h-8 w-8 items-center justify-center
            rounded-full bg-white text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
          aria-label={t("saveToWishlist")}
        >
          <Heart
            className={`h-4 w-4 ${wishlisted ? "fill-rose-500 text-rose-500" : "fill-none stroke-[1.75]"}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* —— Mobile: compact horizontal (matches booking-style card) —— */}
        <div className="flex min-h-0 flex-1 flex-col p-2.5 pb-3 sm:hidden">
          <h3 className="text-[14px] font-bold leading-snug text-gray-900 line-clamp-2">
            {hotelName}
          </h3>
          {starRating > 0 && (
            <div className="mt-1">
              <StarRating rating={starRating} compact />
            </div>
          )}

          <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span
              className="inline-flex shrink-0 items-center rounded-full rounded-tr-none bg-primary px-1.5 py-0.5
                text-[11px] font-bold text-white"
            >
              {reviewScore.toFixed(1)}/10
            </span>
            <span className="text-[11px] font-semibold text-primary">
              {t(ratingLabelKey(reviewScore))}
            </span>
          </div>

          {locationText && (
            <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-gray-500">
              {locationText}
            </p>
          )}

          {(hasFreeCancellation || hasBreakfast) && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {hasFreeCancellation && (
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-medium
                    bg-[#e8f4f3] text-[#0d7061]"
                >
                  {t("cancellationShort")}
                </span>
              )}
              {hasBreakfast && (
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-medium
                    bg-[#e8f4f3] text-[#0d7061]"
                >
                  {t("breakfastIncluded")}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto flex flex-col items-end gap-0.5 pt-2">
            <div className="flex items-baseline gap-0.5">
              <span className="text-[12px] font-semibold text-primary">
                <CurrencySymbol
                  size="sm"
                  className="text-[12px] font-semibold text-primary"
                />
              </span>
              <span className="text-[22px] font-bold leading-none tracking-tight text-primary">
                {Math.round(totalPrice).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* —— sm+: original richer layout —— */}
        <div className="hidden min-h-0 flex-1 flex-col p-4 sm:flex">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[18px] font-bold leading-snug text-gray-900 line-clamp-2">
                  {hotelName}
                </h3>
                {starRating > 0 && <StarRating rating={starRating} />}
              </div>
              {locationText && (
                <p className="mt-2 flex items-center gap-1 text-[14px] text-gray-600">
                  <MapPin className="shrink-0 size-4" />
                  <span className="line-clamp-2">{locationText}</span>
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-start gap-2 sm:flex-col sm:items-end sm:text-end">
              <div
                className="flex h-9 min-w-11 items-center justify-center rounded-full rounded-tr-none
                  bg-primary px-2 text-[16px] font-bold text-white"
              >
                {reviewScore.toFixed(1)}
              </div>
            </div>
          </div>

          <div
            className="mt-5 flex flex-1 flex-col gap-4 min-[500px]:flex-row min-[500px]:items-end
              min-[500px]:justify-between min-[500px]:gap-6"
          >
            <div className="min-w-0 flex-1 border-s border-gray-300 ps-3">
              {roomTypeLabel && (
                <p className="text-[16px] font-medium text-gray-900">
                  {roomTypeLabel}
                </p>
              )}
              {occupancyLines.length > 0 && (
                <div className="mt-0.5 flex min-w-0 flex-col gap-1 text-[14px] text-gray-900">
                  {occupancyLines.map((row) => {
                    const Icon = OCCUPANCY_ICONS[row.key];
                    return (
                      <div key={row.key} className="flex items-center gap-1.5">
                        <Icon
                          className="shrink-0 size-4 text-gray-700"
                          aria-hidden
                        />
                        <span>{row.text}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {hasFreeCancellation && (
                <p className="mt-1.5 text-[14px] font-medium text-green-600">
                  {t("freeCancellation")}
                </p>
              )}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1 self-stretch min-[500px]:self-end">
              <div className="flex items-baseline gap-1">
                <span className="text-[15px] font-semibold text-gray-900">
                  <CurrencySymbol
                    size="sm"
                    className="text-[15px] font-semibold"
                  />
                </span>
                <span className="text-[26px] font-bold leading-none tracking-tight text-gray-900">
                  {Math.round(perNightPrice).toLocaleString()}
                </span>
              </div>
              {nights > 1 && (
                <p className="text-[13px] text-gray-500">
                  {t("stayTotalLine", {
                    total: Math.round(totalPrice).toLocaleString(),
                    nights,
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
