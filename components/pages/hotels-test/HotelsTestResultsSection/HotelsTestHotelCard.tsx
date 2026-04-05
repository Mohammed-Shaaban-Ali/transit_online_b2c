"use client";

import Image from "next/image";
import {
  MapPin,
  Heart,
  Star,
  ChevronRight,
  Bed,
  User,
  Baby,
} from "lucide-react";
import { hotelSeachTypes } from "@/types/hotels";
import { convertPrice } from "@/config/currency";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { useState } from "react";

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
function StarRating({ rating }: { rating: number }) {
  const stars = Math.min(Math.max(Math.round(rating), 0), 5);
  return (
    <div className="flex items-center gap-px shrink-0" aria-hidden>
      {Array.from({ length: stars }).map((_, i) => (
        <Star
          key={i}
          className="h-[14px] w-[14px] fill-[#febb02] text-[#febb02]"
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

/** Decorative carousel dots (single image) */
function ImageCarouselDots() {
  return (
    <div
      className="pointer-events-none absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5"
      aria-hidden
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-white/50"}`}
        />
      ))}
    </div>
  );
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

function getOccupancyLines(
  rooms: number | undefined,
  adults: number | undefined,
  children: number | undefined,
): { key: OccupancyRowKey; text: string }[] {
  const lines: { key: OccupancyRowKey; text: string }[] = [];
  if (rooms != null && rooms > 0) {
    lines.push({
      key: "rooms",
      text: `${rooms} ${rooms === 1 ? "room" : "rooms"}`,
    });
  }
  if (adults != null && adults >= 0) {
    lines.push({
      key: "adults",
      text: `${adults} ${adults === 1 ? "adult" : "adults"}`,
    });
  }
  if (children != null && children >= 0) {
    lines.push({
      key: "children",
      text: `${children} ${children === 1 ? "child" : "children"}`,
    });
  }
  return lines;
}

export default function HotelsTestHotelCard({
  hotel,
  nights = 1,
  rooms,
  adults,
  children,
}: Props) {
  const [wishlisted, setWishlisted] = useState(false);

  const rawPrice = parseFloat(
    hotel.price?.toString().replace(/[^\d.]/g, "") || "0",
  );
  const perNightPrice = convertPrice(rawPrice);
  const totalPrice = perNightPrice * nights;

  const starRating = hotel.starRating ? Number(hotel.starRating) : 0;
  const reviewScore = starRating > 0 ? Math.min(10, starRating * 2) : 8.5;

  const hasFreeCancellation =
    hotel.facilities?.some((f: { name?: string }) =>
      f?.name?.toLowerCase().includes("free cancellation"),
    ) || false;

  const roomTypeLabel = hotel.facilities?.find((f: { name?: string }) =>
    f?.name?.toLowerCase().includes("room"),
  )?.name;

  const locationText = hotel.locationDetails || hotel.address;

  const occupancyLines = getOccupancyLines(rooms, adults, children);

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-lg border
     border-gray-200 hover:border-gray-300 bg-white font-sans transition-shadow duration-200
       sm:flex-row"
    >
      {/* Image ~30% */}
      <div
        className="relative h-[240px] w-full shrink-0  sm:w-[30%] sm:min-w-[200px]
       sm:max-w-[320px] overflow-hidden"
      >
        {hotel.defaultImage?.FullSize ? (
          <Image
            src={hotel.defaultImage.FullSize}
            alt={hotel.displayName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-sm text-gray-400">No image</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setWishlisted((p) => !p)}
          className="absolute top-2.5 end-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
          aria-label="Save to wishlist"
        >
          <Heart
            className={`h-4 w-4 ${wishlisted ? "fill-rose-500 text-rose-500" : "fill-none stroke-[1.75]"}`}
          />
        </button>
      </div>

      {/* Content ~70% */}
      <div className="flex min-w-0 flex-1 flex-col p-4">
        {/* Top: title block + review badge */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[18px] font-bold leading-snug text-gray-900 line-clamp-2">
                {hotel.displayName}
              </h3>
              {starRating > 0 && <StarRating rating={starRating} />}
            </div>
            {locationText && (
              <p className="mt-2 flex  items-center gap-1 text-[14px]  text-gray-600">
                <MapPin className="shrink-0 size-4" />
                <span className="line-clamp-2">{locationText}</span>
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-start gap-2 sm:flex-col sm:items-end sm:text-end">
            <div
              className="flex h-9 min-w-11 items-center justify-center rounded-full rounded-tr-none bg-primary
             px-2 text-[16px] font-bold text-white"
            >
              {reviewScore.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Bottom: room column + price column */}
        <div className="mt-5 flex flex-1 flex-col gap-4 min-[500px]:flex-row min-[500px]:items-end min-[500px]:justify-between min-[500px]:gap-6">
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
                Free Cancellation
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

            <button
              type="button"
              className="mt-2 flex w-full min-[500px]:w-auto items-center justify-center gap-1 rounded
               bg-primary  px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-primary/80 
               min-[500px]:min-w-[180px]"
            >
              Check Availability
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
