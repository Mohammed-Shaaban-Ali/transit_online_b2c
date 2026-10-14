import type { Metadata } from "next";
import type { IHotelDetails } from "@/types/hotels";
import {
  pickLocalizedHotelName,
  type HotelSeoFields,
} from "@/utils/hotels/hotelSeoQuery";
import { buildPageMetadata } from "./buildPageMetadata";
import { SITE_NAME } from "./pages";

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function firstHotelDescription(
  details: IHotelDetails | null,
  locale: string,
): string | undefined {
  const descriptions = details?.hotelContent?.descriptions;
  if (!descriptions?.length) return undefined;

  const preferred =
    descriptions.find((d) =>
      locale === "ar"
        ? d.language?.toLowerCase().startsWith("ar")
        : d.language?.toLowerCase().startsWith("en"),
    ) || descriptions[0];

  const text = preferred?.description?.trim();
  if (!text) return undefined;
  const clean = stripHtml(text);
  return clean.length > 160 ? `${clean.slice(0, 157)}...` : clean;
}

export function buildHotelSearchMetadata(options: {
  locale: string;
  searchValue?: string;
  checkIn?: string;
  checkOut?: string;
  path?: string;
}): Metadata {
  const { locale, searchValue, checkIn, checkOut, path } = options;
  const destination = searchValue?.trim();
  const isAr = locale === "ar";

  const title = destination
    ? isAr
      ? `فنادق في ${destination}`
      : `Hotels in ${destination}`
    : isAr
      ? "نتائج البحث عن الفنادق"
      : "Hotel search results";

  const datePart =
    checkIn && checkOut
      ? isAr
        ? ` من ${checkIn} إلى ${checkOut}`
        : ` from ${checkIn} to ${checkOut}`
      : "";

  const description = destination
    ? isAr
      ? `اعثر على أفضل الفنادق في ${destination}${datePart}. قارن الأسعار واحجز أونلاين مع ${SITE_NAME}.`
      : `Find the best hotels in ${destination}${datePart}. Compare prices and book online with ${SITE_NAME}.`
    : isAr
      ? `ابحث عن الفنادق وقارن الأسعار واحجز إقامتك مع ${SITE_NAME}.`
      : `Search hotels, compare prices, and book your stay with ${SITE_NAME}.`;

  return buildPageMetadata({
    locale,
    page: "hotelDetails",
    path: path || "/hotels/details",
    title,
    description,
    keywords: destination
      ? [
          destination,
          isAr ? "فنادق" : "hotels",
          isAr ? "حجز فنادق" : "hotel booking",
          SITE_NAME,
        ]
      : undefined,
  });
}

export function buildHotelDetailMetadata(options: {
  locale: string;
  hotelId: string;
  path: string;
  seoFields: HotelSeoFields;
  details?: IHotelDetails | null;
}): Metadata {
  const { locale, hotelId, path, seoFields, details } = options;
  const isAr = locale === "ar";
  const hotelName = pickLocalizedHotelName(locale, seoFields);
  const address = seoFields.address?.trim();
  const stars = seoFields.starRating
    ? Number(seoFields.starRating)
    : undefined;
  const starsLabel =
    stars && Number.isFinite(stars) && stars > 0
      ? isAr
        ? ` ${"★".repeat(Math.min(Math.round(stars), 5))}`
        : ` ${"★".repeat(Math.min(Math.round(stars), 5))}`
      : "";

  const title = hotelName
    ? `${hotelName}${starsLabel}`
    : isAr
      ? "تفاصيل الفندق"
      : "Hotel details";

  const apiDescription = firstHotelDescription(details ?? null, locale);
  const description = apiDescription
    ? apiDescription
    : hotelName
      ? isAr
        ? `احجز ${hotelName}${address ? ` في ${address}` : ""}. اطّلع على الغرف والأسعار والمرافق واحجز مع ${SITE_NAME}.`
        : `Book ${hotelName}${address ? ` in ${address}` : ""}. View rooms, prices, and amenities and reserve with ${SITE_NAME}.`
      : undefined;

  const image =
    seoFields.hotelImage ||
    details?.hotelContent?.images?.[0] ||
    details?.packages?.[0]?.images?.[0] ||
    null;

  return buildPageMetadata({
    locale,
    page: "hotelDetails",
    path,
    title,
    description,
    image,
    keywords: [
      hotelName,
      address,
      isAr ? "فندق" : "hotel",
      isAr ? "حجز فندق" : "book hotel",
      SITE_NAME,
      hotelId,
    ].filter(Boolean) as string[],
  });
}

export function buildHotelBookingMetadata(options: {
  locale: string;
  hotelId: string;
  path: string;
  seoFields: HotelSeoFields;
}): Metadata {
  const { locale, hotelId, path, seoFields } = options;
  const isAr = locale === "ar";
  const hotelName = pickLocalizedHotelName(locale, seoFields);
  const address = seoFields.address?.trim();

  const title = hotelName
    ? isAr
      ? `حجز ${hotelName}`
      : `Book ${hotelName}`
    : isAr
      ? "حجز الفندق"
      : "Hotel booking";

  const description = hotelName
    ? isAr
      ? `أكمل حجز ${hotelName}${address ? ` في ${address}` : ""} مع ${SITE_NAME}.`
      : `Complete your booking for ${hotelName}${address ? ` in ${address}` : ""} with ${SITE_NAME}.`
    : undefined;

  return buildPageMetadata({
    locale,
    page: "hotelBooking",
    path,
    title,
    description,
    image: seoFields.hotelImage,
    indexable: false,
    keywords: [
      hotelName,
      address,
      isAr ? "حجز فندق" : "hotel booking",
      SITE_NAME,
      hotelId,
    ].filter(Boolean) as string[],
  });
}
