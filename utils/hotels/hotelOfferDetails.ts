import type { hotelSeachTypes } from "@/types/hotels";
import type { IHotelOffer } from "@/types/website";

export const DEFAULT_HOTEL_OFFER_ROOMS: {
  AdultsCount: number;
  KidsAges: number[];
}[] = [{ AdultsCount: 2, KidsAges: [] }];

/** Normalize offer/API dates to YYYY-MM-DD for hotel-packages. */
export function normalizeHotelDate(value: string): string {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return trimmed;
  return parsed.toISOString().slice(0, 10);
}

export function parseRoomsSearchParam(
  roomsParam?: string,
): { AdultsCount: number; KidsAges: number[] }[] {
  if (!roomsParam) return DEFAULT_HOTEL_OFFER_ROOMS;
  try {
    const parsed = JSON.parse(roomsParam) as {
      AdultsCount: number;
      KidsAges: number[];
    }[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* use default */
  }
  return DEFAULT_HOTEL_OFFER_ROOMS;
}

export function buildHotelOfferSearchParams(
  checkIn: string,
  checkOut: string,
  rooms: { AdultsCount: number; KidsAges: number[] }[] = DEFAULT_HOTEL_OFFER_ROOMS,
): URLSearchParams {
  return new URLSearchParams({
    checkIn: normalizeHotelDate(checkIn),
    checkOut: normalizeHotelDate(checkOut),
    rooms: JSON.stringify(rooms),
  });
}

/** Intermediate details route: server fetches uuid then redirects to /[uuid]. */
export function buildHotelOfferDetailsHref(offer: IHotelOffer): string {
  const params = buildHotelOfferSearchParams(offer.check_in, offer.check_out);
  return `/hotels/details/${offer.hotel_id}?${params.toString()}`;
}

export function buildHotelDetailsUuidHref(
  hotelId: string | number,
  uuid: string,
  searchParams: URLSearchParams,
): string {
  const query = searchParams.toString();
  return `/hotels/details/${hotelId}/${uuid}${query ? `?${query}` : ""}`;
}

/** Maps a CMS hotel offer into localStorage shape used by SingleHotel. */
export function mapOfferToHotelStorage(offer: IHotelOffer): hotelSeachTypes {
  return {
    id: String(offer.hotel_id),
    displayName: offer.hotel_name,
    displayNameAr: offer.hotel_name,
    address: offer.city_name,
    starRating: offer.rating,
    price: offer.price,
    defaultImage: { FullSize: offer.image },
    locationDetails: offer.city_name,
  };
}
