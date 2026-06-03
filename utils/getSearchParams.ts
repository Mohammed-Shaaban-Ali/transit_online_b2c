import { localStorageHotelSearchKey } from "@/constants";
import { searchHotelsParams } from "@/types/hotels";

export const getSearchParamsData = (): searchHotelsParams | undefined => {
  if (typeof window === "undefined") return undefined;

  const searchParams = new URLSearchParams(window.location.search);
  const storedSearch = localStorage.getItem(localStorageHotelSearchKey);

  // Try to get from URL params first
  const country = searchParams.get("country") || "US";
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const roomsParam = searchParams.get("rooms");

  const parseRooms = () => {
    if (!roomsParam) return [{ AdultsCount: 2, KidsAges: [] as number[] }];
    try {
      const parsed = JSON.parse(roomsParam);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      /* default below */
    }
    return [{ AdultsCount: 2, KidsAges: [] as number[] }];
  };

  // Hotel offers / package flow: dates + rooms only (no map coordinates)
  if (checkIn && checkOut && !lat && !lng) {
    return {
      country,
      checkIn,
      checkOut,
      location: { latitude: 0, longitude: 0 },
      radiusInMeters: 10000,
      rooms: parseRooms(),
    };
  }

  // Full hotel search: dates + map location
  if (checkIn && checkOut && lat && lng) {
    return {
      country,
      checkIn,
      checkOut,
      location: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      },
      radiusInMeters: 10000,
      rooms: parseRooms(),
    };
  }

  // Otherwise, try to get from localStorage
  if (storedSearch) {
    try {
      const parsed = JSON.parse(storedSearch);
      if (parsed.checkIn && parsed.checkOut && parsed.location) {
        return parsed;
      }
    } catch (e) {
      console.error("Error parsing stored search:", e);
    }
  }

  return undefined;
};

