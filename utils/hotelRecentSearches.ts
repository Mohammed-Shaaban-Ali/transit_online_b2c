import { localStorageHotelRecentSearchesKey } from "@/constants";
import type { searchHotelsParams } from "@/types/hotels";

export type HotelRecentSearchItem = searchHotelsParams & {
  searchValue?: string;
  locationId?: number;
  locationCode?: string;
  storedLocale?: string;
};

const MAX_RECENT = 5;

function sameStay(a: HotelRecentSearchItem, b: HotelRecentSearchItem) {
  return (
    a.checkIn === b.checkIn &&
    a.checkOut === b.checkOut &&
    a.location?.latitude === b.location?.latitude &&
    a.location?.longitude === b.location?.longitude &&
    (a.searchValue || "") === (b.searchValue || "")
  );
}

export function getHotelRecentSearches(): HotelRecentSearchItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(localStorageHotelRecentSearchesKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function pushHotelRecentSearch(entry: HotelRecentSearchItem) {
  if (typeof window === "undefined") return;
  if (!entry.location || entry.location.latitude === 0 || entry.location.longitude === 0) {
    return;
  }
  try {
    let list = getHotelRecentSearches();
    list = list.filter((item) => !sameStay(item, entry));
    list.unshift(entry);
    list = list.slice(0, MAX_RECENT);
    localStorage.setItem(localStorageHotelRecentSearchesKey, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}
