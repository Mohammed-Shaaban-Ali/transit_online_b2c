/** Query keys used for hotel detail SEO (path stays the same). */
export const HOTEL_SEO_NAME = "hotelName";
export const HOTEL_SEO_NAME_AR = "hotelNameAr";
export const HOTEL_SEO_ADDRESS = "address";
export const HOTEL_SEO_IMAGE = "hotelImage";
export const HOTEL_SEO_RATING = "starRating";

export type HotelSeoFields = {
  hotelName?: string | null;
  hotelNameAr?: string | null;
  address?: string | null;
  hotelImage?: string | null;
  starRating?: string | number | null;
};

/** Appends hotel SEO fields onto existing search params without dropping others. */
export function appendHotelSeoParams(
  params: URLSearchParams,
  fields: HotelSeoFields,
): URLSearchParams {
  const next = new URLSearchParams(params.toString());

  if (fields.hotelName?.trim()) {
    next.set(HOTEL_SEO_NAME, fields.hotelName.trim());
  }
  if (fields.hotelNameAr?.trim()) {
    next.set(HOTEL_SEO_NAME_AR, fields.hotelNameAr.trim());
  }
  if (fields.address?.trim()) {
    next.set(HOTEL_SEO_ADDRESS, fields.address.trim());
  }
  if (fields.hotelImage?.trim()) {
    next.set(HOTEL_SEO_IMAGE, fields.hotelImage.trim());
  }
  if (fields.starRating != null && String(fields.starRating).trim()) {
    next.set(HOTEL_SEO_RATING, String(fields.starRating).trim());
  }

  return next;
}

export function readHotelSeoFromSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): HotelSeoFields {
  const get = (key: string) => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) || undefined;
    }
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    hotelName: get(HOTEL_SEO_NAME),
    hotelNameAr: get(HOTEL_SEO_NAME_AR),
    address: get(HOTEL_SEO_ADDRESS),
    hotelImage: get(HOTEL_SEO_IMAGE),
    starRating: get(HOTEL_SEO_RATING),
  };
}

export function pickLocalizedHotelName(
  locale: string,
  fields: HotelSeoFields,
): string | undefined {
  if (locale === "ar") {
    return fields.hotelNameAr?.trim() || fields.hotelName?.trim() || undefined;
  }
  return fields.hotelName?.trim() || fields.hotelNameAr?.trim() || undefined;
}
