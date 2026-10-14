import { cookies } from "next/headers";
import { NEXT_LOCALE } from "@/constants";
import type { IHotelDetails } from "@/types/hotels";
import { getServerApiToken } from "./getServerApiToken";

/** Server-side hotel packages/details for SEO metadata. */
export async function fetchHotelDetailsServer(
  hotelID: string,
  uuid: string,
): Promise<IHotelDetails | null> {
  const apiToken = await getServerApiToken();
  const baseUrl = process.env.NEXT_PUBLIC_APP_EFICTA;
  if (!apiToken || !baseUrl || !hotelID || !uuid) return null;

  const cookieStore = await cookies();
  const locale = cookieStore.get(NEXT_LOCALE)?.value || "en";

  try {
    const res = await fetch(`${baseUrl}/api/hotels/b2c/packages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": apiToken,
        lng: locale,
        b2c: "1",
      },
      body: JSON.stringify({
        uuid,
        hotelID,
        roomNameResponseLanguage: locale,
      }),
      cache: "no-store",
    });

    if (!res.ok) return null;
    return (await res.json()) as IHotelDetails;
  } catch {
    return null;
  }
}
