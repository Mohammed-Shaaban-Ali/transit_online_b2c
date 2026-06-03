import { cookies } from "next/headers";
import { NEXT_LOCALE } from "@/constants";
import type { RevalidatePackagesResponse } from "@/redux/features/hotels/hotelsApi";
import { getServerApiToken } from "./getServerApiToken";

export type HotelPackagesRequestBody = {
  checkIn: string;
  checkOut: string;
  hotelIds: number[];
  rooms: {
    AdultsCount: number;
    KidsAges: number[];
  }[];
};

export async function fetchHotelPackagesServer(
  body: HotelPackagesRequestBody,
): Promise<RevalidatePackagesResponse | null> {
  const apiToken = await getServerApiToken();
  const baseUrl = process.env.NEXT_PUBLIC_APP_EFICTA;
  if (!apiToken || !baseUrl) return null;

  const cookieStore = await cookies();
  const locale = cookieStore.get(NEXT_LOCALE)?.value || "en";

  try {
    const res = await fetch(`${baseUrl}/api/hotels/b2c/hotel-packages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": apiToken,
        lng: locale,
        b2c: "1",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) return null;

    return (await res.json()) as RevalidatePackagesResponse;
  } catch {
    return null;
  }
}
