"use client";

import Image from "next/image";
import {
  MapPin,
  Heart,
  Star,
  Bed,
  User,
  Baby,
  ChevronRight,
} from "lucide-react";
import { hotelSeachTypes } from "@/types/hotels";
import { convertPrice } from "@/config/currency";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localStorageHotelKey } from "@/constants";
import hotelCardStyles from "@/public/images/hotels/hotelCard.png";
import { Button } from "@/components/ui/button";
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

/** API `hotel.price` is the stay total (all nights). Strikethrough uses a fixed 25% promo vs per-night. */
const MOCK_PROMO_PERCENT = 25;
const MOCK_REVIEW_COUNT = 300;

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
  /** Total for the whole stay (all nights) from API — always the discounted price. */
  const stayTotal = convertPrice(rawPrice);
  const safeNights = Math.max(nights, 1);
  const pricePerNight = stayTotal / safeNights;
  /** Strikethrough = current price ÷ (1 - 25%) → original before 25% off. */
  const wasTotal = Math.ceil(stayTotal / (1 - MOCK_PROMO_PERCENT / 100));
  const wasPerNight = Math.ceil(pricePerNight / (1 - MOCK_PROMO_PERCENT / 100));
  const roomCount = rooms != null && rooms > 0 ? rooms : 1;

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

  const locationText = hotel.address || hotel.locationDetails;

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
      href={`/hotels/details/${hotel.id}/${uuid}`}
      onClick={persistHotelAndNavigate}
      className="group flex flex-row items-stretch overflow-hidden rounded-lg border
        border-gray-200 bg-white font-sans transition-shadow duration-200
          hover:border-gray-300  max-sm:min-h-[168px]"
    >
      {/* Image — ~35% on phone, ~30% on sm+ */}
      <div
        className="relative w-[35%] min-w-[112px] max-w-[42%] shrink-0 overflow-hidden
          max-sm:max-w-none max-sm:rounded-s-xl sm:w-[30%] sm:min-w-[200px] sm:max-w-[220px]
          max-sm:h-auto max-sm:min-h-[168px] sm:min-h-[230px] sm:max-h-none sm:rounded-none"
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
          className="absolute top-4 end-4 z-10 flex size-9 items-center justify-center
            rounded-full bg-white text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
          aria-label={t("saveToWishlist")}
        >
          <Heart
            className={`size-5 ${wishlisted ? "fill-rose-500 text-rose-500" : "fill-none stroke-[1.75]"}`}
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

          <div className="mt-auto flex w-full flex-col items-end gap-1 pt-2">
            <div
              className="flex flex-row items-baseline justify-end gap-2"
              dir="ltr"
            >
              <span className="inline-flex items-baseline gap-0.5 text-[12px] text-gray-500 line-through">
                <CurrencySymbol size="sm" className="text-[12px]" />
                {wasTotal.toLocaleString()}
              </span>
              <span className="inline-flex items-baseline gap-0.5 text-[22px] font-bold leading-none tracking-tight text-[#1a1a1a]">
                <CurrencySymbol
                  size="sm"
                  className="text-[14px] font-bold text-[#1a1a1a]"
                />
                {Math.round(stayTotal).toLocaleString()}
              </span>
            </div>
            <p className="text-end text-[11px] text-gray-600">
              <span>{t("totalPriceLabel")} </span>
              <span className="font-semibold text-gray-800">
                <CurrencySymbol size="sm" className="text-[11px]" />
                {Math.round(stayTotal).toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        {/* —— sm+: original richer layout —— */}
        <div className="hidden min-h-0 flex-1 flex-col p-4 px-5 sm:flex">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[20px] font-bold leading-snug line-clamp-2 hover:underline">
                  {hotelName}
                </h3>

                {starRating > 0 && <StarRating rating={starRating} compact />}
              </div>
              {locationText && (
                <p className="mt-2 flex items-center gap-1.5 text-[15px] ">
                  <MapPin className="shrink-0 size-4" />
                  <span className="line-clamp-2">{locationText}</span>
                </p>
              )}
              <p className="mt-2 flex items-center gap-1.5 text-[15px] ">
                <Image
                  src={hotelCardStyles}
                  alt="hotel card"
                  width={14}
                  height={14}
                />
                <span className="line-clamp-2">{t("paymentsEasyReach")}</span>
              </p>
            </div>

            <div className="flex shrink-0 items-start gap-2 sm:items-center">
              <div className="flex flex-col items-end leading-tight">
                <span className="text-[15px] font-semibold ">
                  {t(ratingLabelKey(reviewScore))}
                </span>

                <span className="mt-0.5 text-[12px] font-medium text-gray-500">
                  {t("reviews", { count: MOCK_REVIEW_COUNT })}
                </span>
              </div>
              <div
                className="flex h-8  min-w-[34px] items-center justify-center rounded-xl rounded-tr-none
                  bg-primary px-2 text-[16px] font-bold text-white shrink-0"
              >
                {reviewScore.toFixed(1)}
              </div>
            </div>
          </div>

          <div
            className="mt-2.5 flex flex-1 flex-col gap-4 min-[500px]:flex-row min-[500px]:items-end
              min-[500px]:justify-between min-[500px]:gap-6"
          >
            <div className="min-w-0 flex-1 border-s-2 border-gray-200 ps-3 ms-2">
              {roomTypeLabel && (
                <p className="text-[15px]  ">{roomTypeLabel}</p>
              )}
              {occupancyLines.length > 0 && (
                <div className="mt-0.5 flex min-w-0 flex-col gap-1 text-[15px]">
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

              <div className="flex items-center gap-1.5 text-[15px] text-gray-600">
                {t("lastBookedStatic")}
              </div>
              {hasFreeCancellation && (
                <p className="mt-1.5 text-[14px] font-medium text-green-600">
                  {t("freeCancellation")}
                </p>
              )}
            </div>

            <div className="flex w-full min-w-0 shrink-0 flex-col items-stretch gap-2 self-stretch min-[500px]:w-auto min-[500px]:min-w-[220px] min-[500px]:max-w-[280px] min-[500px]:items-end min-[500px]:self-end">
              <div
                className="flex flex-row items-baseline justify-end gap-2"
                dir="ltr"
              >
                <span className="inline-flex items-baseline gap-0.5 text-[15px] text-gray-500 line-through">
                  <CurrencySymbol size="sm" />
                  {wasTotal.toLocaleString()}
                </span>
                <span className="inline-flex items-baseline gap-1 text-[26px] font-bold leading-none tracking-tight text-[#1a1a1a]">
                  <CurrencySymbol
                    size="md"
                    className="text-[24px] font-bold text-[#1a1a1a]"
                  />
                  {Math.round(stayTotal).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-end text-[13px] ">
                  <span>{t("totalPriceLabel")} </span>
                  <span className="font-semibold ">
                    <CurrencySymbol size="sm" className="text-[13px]" />
                    {Math.round(stayTotal).toLocaleString()}
                  </span>
                </p>
                <p className="text-end text-[11px] leading-snug ">
                  {t("roomNightsInclTaxes", {
                    roomCount,
                    nightCount: safeNights,
                  })}
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-1.5">
                <span className="rounded bg-[#fff1f2] px-2 py-0.5 text-[11px] font-medium text-[#e11d48]">
                  {t("specialDiscountBadge")}
                </span>
                <span className="rounded bg-[#fff1f2] px-2 py-0.5 text-[11px] font-medium text-[#e11d48]">
                  {t("percentOffBadge")}
                </span>
              </div>
              <Button
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded 
              h-10!
              px-4 py-2.5 text-[14px] font-semibold text-white min-[500px]:max-w-[260px]"
              >
                {t("checkAvailability")}
                <ChevronRight
                  className="size-4 shrink-0 rtl:rotate-180"
                  aria-hidden
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
