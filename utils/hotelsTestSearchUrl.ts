import type { searchHotelsParams } from "@/types/hotels";

/** Form fields aligned with HotelsTestHotelSearchForm (avoid circular imports). */
export type HotelsTestUrlFormDefaults = {
  country: string;
  checkIn: string;
  checkOut: string;
  location: { latitude: number; longitude: number };
  radiusInMeters: number;
  rooms: { AdultsCount: number; KidsAges: number[] }[];
  searchValue?: string;
  locationId?: number;
  locationCode?: string;
  storedLocale?: string;
};

export function getHotelSearchParamsFromUrl(
  searchParams: URLSearchParams,
): searchHotelsParams | undefined {
  const country = searchParams.get("country") || "US";
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const roomsParam = searchParams.get("rooms");
  const radiusParam = searchParams.get("radiusInMeters");

  if (!checkIn || !checkOut || !lat || !lng) return undefined;

  let rooms: { AdultsCount: number; KidsAges: number[] }[] = [
    { AdultsCount: 2, KidsAges: [] },
  ];
  if (roomsParam) {
    try {
      rooms = JSON.parse(roomsParam) as typeof rooms;
    } catch {
      /* keep default */
    }
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return undefined;

  return {
    country,
    checkIn,
    checkOut,
    location: { latitude, longitude },
    radiusInMeters: radiusParam ? parseInt(radiusParam, 10) : 10000,
    rooms,
  };
}

export function getHotelsTestFormDefaultsFromUrl(
  searchParams: URLSearchParams,
): Partial<HotelsTestUrlFormDefaults> | undefined {
  const api = getHotelSearchParamsFromUrl(searchParams);
  if (!api) return undefined;

  const searchValue = searchParams.get("searchValue")?.trim();
  const locationIdStr = searchParams.get("locationId");
  const locationCode = searchParams.get("locationCode")?.trim();
  const storedLocale = searchParams.get("storedLocale")?.trim();
  const locationIdParsed = locationIdStr
    ? parseInt(locationIdStr, 10)
    : undefined;
  const locationId =
    locationIdParsed !== undefined && !Number.isNaN(locationIdParsed)
      ? locationIdParsed
      : undefined;

  return {
    country: api.country,
    checkIn: api.checkIn,
    checkOut: api.checkOut,
    location: api.location,
    radiusInMeters: api.radiusInMeters,
    rooms: api.rooms,
    ...(searchValue ? { searchValue } : {}),
    ...(locationId != null ? { locationId } : {}),
    ...(locationCode ? { locationCode } : {}),
    ...(storedLocale ? { storedLocale } : {}),
  };
}
